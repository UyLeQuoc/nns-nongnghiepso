using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using nns_backend.DTO.BlogDTOs;
using nns_backend.Entities;
using nns_backend.Interfaces;

namespace nns_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly ILogger<BlogController> _logger;
        private readonly IBlogRepository _blogRepository;
        private readonly IMapper _mapper;

        public BlogController(ILogger<BlogController> logger, IBlogRepository blogRepository, IMapper mapper)
        {
            _logger = logger;
            _blogRepository = blogRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<BlogResponseDTO>>> GetBlogs()
        {
            var blogs = await _blogRepository.GetBlogsAsync();
            var blogsDTO = _mapper.Map<List<BlogResponseDTO>>(blogs);
            return Ok(blogsDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogResponseDTO>> GetBlogById(int id)
        {
            var blog = await _blogRepository.GetBlogByIdAsync(id);
            if (blog == null)
            {
                return NotFound();
            }
            var blogDTO = _mapper.Map<BlogResponseDTO>(blog);
            return Ok(blogDTO);
        }

        [HttpPost]
        public async Task<ActionResult<BlogResponseDTO>> CreateBlog(BlogCreateDTO blogCreateDTO)
        {
            var blog = _mapper.Map<Blog>(blogCreateDTO);
            blog.CreatedAt = DateTime.UtcNow;
            blog = await _blogRepository.CreateBlogAsync(blog);
            var blogDTO = _mapper.Map<BlogResponseDTO>(blog);
            return CreatedAtAction(nameof(GetBlogById), new { id = blogDTO.Id }, blogDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlog(int id, BlogUpdateDTO blogUpdateDTO)
        {
            var blog = await _blogRepository.GetBlogByIdAsync(id);
            if (blog == null)
            {
                return NotFound();
            }

            blogUpdateDTO.Id = id;

            _mapper.Map(blogUpdateDTO, blog);
            await _blogRepository.UpdateBlogAsync(blog);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _blogRepository.GetBlogByIdAsync(id);
            if (blog == null)
            {
                return NotFound();
            }

            await _blogRepository.DeleteBlogAsync(id);

            return NoContent();
        }
    }
}
