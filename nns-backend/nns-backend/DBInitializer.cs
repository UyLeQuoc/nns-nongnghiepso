using Microsoft.AspNetCore.Identity;
using nns_backend.Entities;

namespace nns_backend
{
    public class DBInitializer
    {
        public static async Task Initialize(NNSDBContext context, UserManager<User> userManager)
        {
            try
            {
                // Add Roles if they don't exist
                if (!context.Roles.Any())
                {
                    var roles = new List<Role>
                    {
                        new Role { Name = "ADMIN", NormalizedName = "ADMIN" },
                        new Role { Name = "AGENT", NormalizedName = "AGENT" }
                    };

                    await context.Roles.AddRangeAsync(roles);
                    await context.SaveChangesAsync();
                }

                // Add Admin User if it doesn't exist
                if (!context.Users.Any(u => u.UserName == "admin"))
                {
                    var adminUser = new User
                    {
                        UserName = "admin",
                        Email = "admin@gmail.com"
                    };
                    var result = await userManager.CreateAsync(adminUser, "123456");
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(adminUser, "ADMIN");
                    }
                }

                // Add Blogs if they don't exist
                if (!context.Blogs.Any())
                {
                    var blogs = new List<Blog>
                    {
                        new Blog
                        {
                            Title = "Bèo hoa dâu – Tiềm năng lớn trong sản xuất nông nghiệp",
                            Caption = "Bèo hoa dâu có nhiều tiềm năng lớn trong nông nghiệp như: giảm phát thải khí nhà kính, giảm chi phí về phân bón, sản xuất nông sản sạch, xanh… Mặc dù tiềm năng rất lớn nhưng bèo hoa dâu chưa thật sự đi vào sản xuất lúa bền vững.",
                            YoutubeLink = "https://www.youtube.com/watch?v=1hwRteliFaw"
                        },
                        new Blog
                        {
                            Title = "Tỷ phú nuôi lợn \"không cần tắm\", bỏ túi tiền tỷ, tránh dịch bệnh",
                            Caption = "VTC16 | Tỷ phú nuôi lợn \"không cần tắm\", bỏ túi tiền tỷ, tránh dịch bệnh. Ông Nguyễn Văn Sợi, Hà Nội chăn nuôi lợn không cần tắm, ông dùng đệm lót sinh học và men vi sinh, bí quyết nào giúp ông Sợi tránh được bệnh dịch tả lợn Châu Phi và kiếm tiền tỷ?",
                            YoutubeLink = "https://www.youtube.com/watch?v=4B6pQPEh_X8"
                        }
                    };
                    await context.Blogs.AddRangeAsync(blogs);
                    await context.SaveChangesAsync();
                }

                // Add Agent Users if they don't exist
                var agents = new List<User>
                {
                    new User { UserName = "agent1", Email = "agent1@gmail.com" },
                    new User { UserName = "agent2", Email = "agent2@gmail.com" }
                };

                foreach (var agent in agents)
                {
                    if (!context.Users.Any(u => u.UserName == agent.UserName))
                    {
                        var result = await userManager.CreateAsync(agent, "123456");
                        if (result.Succeeded)
                        {
                            await userManager.AddToRoleAsync(agent, "AGENT");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception if needed and rethrow
                throw new InvalidOperationException("Error initializing database.", ex);
            }
        }
    }
}
