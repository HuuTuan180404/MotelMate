using BACKEND.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using NSwag.Generation.Processors.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using BACKEND.Mappers;
using BACKEND.Interfaces;
using BACKEND.Service;
using Microsoft.OpenApi.Models;
using BACKEND.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Logging;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.Extensions.Options;
using DotNetEnv;

DotNetEnv.Env.Load();
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});
builder.Services.AddMemoryCache();

builder.Services.AddDbContext<MotelMateDbContext>
    (option => option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

builder.Services.AddIdentity<Account, IdentityRole<int>>()
    .AddEntityFrameworkStores<MotelMateDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAutoMapper(typeof(ContractMapper));
builder.Services.AddAutoMapper(typeof(TenantMapper));
builder.Services.AddAutoMapper(typeof(RoomMapper));
builder.Services.AddAutoMapper(typeof(ProfileMapper));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultForbidScheme =
    options.DefaultScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"])
        ),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});
// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultScheme = "Cookies";
//     options.DefaultChallengeScheme = "Google";
// })
// .AddCookie()
// .AddGoogle(options =>
// {
//     options.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
//     options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
//     options.CallbackPath = "/signin-google";
// });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Owner", p => p.RequireRole("Owner"));
    options.AddPolicy("Tenant", p => p.RequireRole("Tenant"));
});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IOtpService, OtpService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IContractService, ContractService>();
builder.Services.AddScoped<MotelDbSeeder>();


// Cloudinary
builder.Services.Configure<CloudinarySettingsAccount>(
    builder.Configuration.GetSection("CloudinarySettingsAccount"));

builder.Services.AddSingleton<CloudinaryDotNet.Cloudinary>(provider =>
{
    var config = provider.GetRequiredService<IOptions<CloudinarySettingsAccount>>().Value;
    var account = new CloudinaryDotNet.Account(config.CloudName, config.ApiKey, config.ApiSecret);
    return new CloudinaryDotNet.Cloudinary(account);
});

// builder.Services.AddSingleton<Cloudinary>(provider =>
// {
//     var config = provider.GetRequiredService<IOptions<CloudinarySettingsAccount>>().Value;
//     var account = new CloudinarySettingsAccount(config.CloudName, config.ApiKey, config.ApiSecret);
//     return new Cloudinary(account);
// });


var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    app.MapOpenApi();

    using (var scope = app.Services.CreateScope())
    {
        // var services = scope.ServiceProvider;
        // var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
        // string[] roleNames = { "Owner", "Tenant" };

        // foreach (var role in roleNames)
        // {
        //     if (!await roleManager.RoleExistsAsync(role))
        //     {
        //         await roleManager.CreateAsync(new IdentityRole<int>(role));
        //     }
        // }
        // var context = services.GetRequiredService<MotelMateDbContext>();
        // MotelDbSeeder.Seed(context);
        var seeder = scope.ServiceProvider.GetRequiredService<MotelDbSeeder>();
        await seeder.SeedAllAsync();
    }
}

app.UseHttpsRedirection();

app.UseCors(x => x
     .AllowAnyMethod()
     .AllowAnyHeader()
     .AllowCredentials()
      //.WithOrigins("https://localhost:44351))
      .SetIsOriginAllowed(origin => true));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
