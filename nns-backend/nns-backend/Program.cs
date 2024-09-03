using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using nns_backend;
using nns_backend.DI;
using nns_backend.Entities;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(config =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,//Cũ là apikey
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Bearer + your token in the box below",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    config.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "NongNghiepSo API",
        Description = "NongNghiepSo API. This is the description",
        Contact = new OpenApiContact
        {
            Name = "Fanpage",
            Url = new Uri("https://www.facebook.com/uyledev/")
        },
        License = new OpenApiLicense
        {
            Name = "Front-end URL",
            Url = new Uri("https://www.facebook.com/uyledev/")
        }
    });

    config.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    config.AddSecurityRequirement(new OpenApiSecurityRequirement
{
        {
            jwtSecurityScheme, Array.Empty<string>()
        }
});
    //var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    //config.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

    // Cấu hình Swagger để sử dụng Newtonsoft.Json
    //config.UseAllOfForInheritance();
});
//SETUP INJECTION SERVICE
builder.Services.AddServicesInjection(builder.Configuration);

builder.Services.AddIdentityCore<User>(opt =>
{
    opt.Password.RequireNonAlphanumeric = false;
    opt.User.RequireUniqueEmail = false;
    opt.Password.RequireUppercase = false;
    opt.Password.RequireLowercase = false;
})
    .AddRoles<Role>()
    .AddEntityFrameworkStores<NNSDBContext>();

builder.Services.AddAuthorization();

//CORS - Set Policy
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicyDevelopement", policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
    });
});

var app = builder.Build();

var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<NNSDBContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

try
{
    await DBInitializer.Initialize(context, userManager);
}
catch (Exception ex)
{
    logger.LogError(ex, "An problem occurred during migration!");
}


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(config =>
    {
        // Always keep token after reload or refresh browser
        config.SwaggerEndpoint("/swagger/v1/swagger.json", "NongNghiepSo API v.01");
        config.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
        //config.InjectJavascript("/custom-swagger.js");
    });
    app.ApplyMigrations(logger);
}
app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("CorsPolicyDevelopement");

app.MapControllers();

app.Run();
