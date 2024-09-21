using AutoMapper;
using nns_backend.DTO;
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

            CreateMap<AgriculturalProduct, AgriculturalProductResponseDTO>()
                .ReverseMap();
            CreateMap<AgriculturalProductCreateDTO, AgriculturalProduct>()
                .ReverseMap();
            CreateMap<AgriculturalProductUpdateDTO, AgriculturalProduct>()
                .ReverseMap();

            CreateMap<ProductType, ProductTypeResponseDTO>()
                .ReverseMap();
            CreateMap<ProductTypeCreateDTO, ProductType>()
                .ReverseMap();
            CreateMap<ProductTypeUpdateDTO, ProductType>()
                .ReverseMap();

            CreateMap<User, ResponseLoginDTO>();
            CreateMap<User, UserShortResponseDTO>();
            CreateMap<AgentProductPreference, AgentProductPreferenceShortResponseDTO>();
        }
    }
}
