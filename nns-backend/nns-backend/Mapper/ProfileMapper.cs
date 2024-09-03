using AutoMapper;
using nns_backend.DTO.BlogDTOs;
using nns_backend.Entities;

namespace nns_backend.Mapper
{
    public class ProfileMapper : Profile
    {
        public ProfileMapper()
        {
            CreateMap<Blog, BlogResponseDTO>()
                .ReverseMap();
            CreateMap<BlogCreateDTO, Blog>()
                .ReverseMap();
            CreateMap<BlogUpdateDTO, Blog>()
                .ReverseMap();
        }
    }
}
