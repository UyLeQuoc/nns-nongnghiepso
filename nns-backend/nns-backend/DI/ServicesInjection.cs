using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using nns_backend.Commons;
using nns_backend.Entities;
using nns_backend.Interfaces;
using nns_backend.Mapper;
using nns_backend.Middlewares;
using nns_backend.Repositories;
using nns_backend.Workers;
using System.Diagnostics;

namespace nns_backend.DI
{
    public static class ServicesInjection
    {
        public static IServiceCollection AddServicesInjection(this IServiceCollection services, IConfiguration configuration)
        {
            // CONNECT TO DATABASE
            services.AddDbContext<NNSDBContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });

            //sign up for middleware
            services.AddSingleton<GlobalExceptionMiddleware>();
            services.AddTransient<PerformanceTimeMiddleware>();
            services.AddScoped<UserStatusMiddleware>(); // sử dụng ClaimsIdentity nên dùng Addscoped theo request
            //others
            services.AddScoped<ICurrentTime, CurrentTime>();
            services.AddSingleton<Stopwatch>();
            services.AddHttpContextAccessor();
            services.AddAutoMapper(typeof(ProfileMapper).Assembly);
            services.AddScoped<IClaimsService, ClaimsService>();
            // add repositories
            services.AddScoped<IBlogRepository, BlogRepository>();
            services.AddScoped<IAgriculturalProductRepository, AgriculturalProductRepository>();
            services.AddScoped<IProductTypeRepository, ProductTypeRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IAgentProductPreferenceRepository, AgentProductPreferenceRepository>();
            services.AddScoped<IFarmToolRepository, FarmToolRepository>();

            // add signInManager
            services.AddScoped<SignInManager<User>>();

            // add services

            // Register the CronJobService
            services.AddHostedService<CronJobService>();

            // add unitOfWork
            return services;
        }
    }
}
