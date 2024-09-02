using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using nns_backend.Entities;
using nns_backend.Middlewares;
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
            //services.AddScoped<ICurrentTime, CurrentTime>();
            services.AddSingleton<Stopwatch>();
            services.AddHttpContextAccessor();
            //services.AddAutoMapper(typeof(MapperConfigProfile).Assembly);
            //services.AddScoped<IClaimsService, ClaimsService>();
            // add repositories

            // add generic repositories


            // add signInManager
            services.AddScoped<SignInManager<User>>();

            // add services


            // add unitOfWork
            return services;
        }
    }
}
