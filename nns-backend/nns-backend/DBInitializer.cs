using Microsoft.AspNetCore.Identity;
using nns_backend.Entities;

namespace nns_backend
{
    public class DBInitializer
    {
        public static async Task Initialize(NNSDBContext context, UserManager<User> userManager)
        {
            //Add Blogs
            if (!context.Blogs.Any())
            {
                var blogs = new List<Blog>
                {
                    new Blog
                    {
                        Title = "Bèo hoa dâu – Tiềm năng lớn trong sản xuất nông nghiệp",
                        Caption = "Bèo hoa dâu có nhiều tiềm năng lớn trong nông nghiệp như: giảm phát thải khí nhà kính, giảm chi phí về phân bón, sản xuất nông sản sạch, xanh… Mặc dù tiềm năng rất lớn nhưng bèo hoa dâu chưa thật sự đi vào sản xuất lúa bền vững. ",
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
            //Add Roles
            try
            {
                if (!context.Roles.Any())
                {
                    var roles = new List<Role>
                {
                    new Role
                    {
                        Name = "Admin",
                        NormalizedName = "ADMIN"
                    },
                    new Role
                    {
                        Name = "Agent",
                        NormalizedName = "AGENT"
                    }
                };
                    await context.Roles.AddRangeAsync(roles);
                    await context.SaveChangesAsync();

                    //Add Admin
                    var user = new User
                    {
                        UserName = "admin",
                        Email = "admin@gmail.com"
                    };
                    await userManager.CreateAsync(user);
                    await userManager.AddToRoleAsync(user, "Admin");

                    //Add Agent
                    var user1 = new User
                    {
                        UserName = "agent1",
                        Email = "agent1@gmail.com"
                    };
                    await userManager.CreateAsync(user1);
                    await userManager.AddToRoleAsync(user1, "Agent");

                    var user2 = new User
                    {
                        UserName = "agent2",
                        Email = "agent2@gmail.com"
                    };
                    await userManager.CreateAsync(user2);
                    await userManager.AddToRoleAsync(user2, "Agent");
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
