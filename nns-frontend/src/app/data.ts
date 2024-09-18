export const agriculturalProducts:any = [
    {
      name: "Cà phê",
      types: [
        {
          name: "Cà phê Buôn Ma Thuột",
          prices: [
            { date: "2023-06-01", price: 39000 },
            { date: "2023-06-02", price: 40000 },
            { date: "2023-06-03", price: 41000 },
            { date: "2023-06-04", price: 40500 },
            { date: "2023-06-05", price: 40000 },
          ]
        },
        {
          name: "Cà phê Đắk Lắk",
          prices: [
            { date: "2023-06-01", price: 37000 },
            { date: "2023-06-02", price: 38000 },
            { date: "2023-06-03", price: 38500 },
            { date: "2023-06-04", price: 38000 },
            { date: "2023-06-05", price: 37500 },
          ]
        },
      ]
    },
    {
      name: "Trà",
      types: [
        {
          name: "Trà Thái Nguyên",
          prices: [
            { date: "2023-06-01", price: 195000 },
            { date: "2023-06-02", price: 200000 },
            { date: "2023-06-03", price: 205000 },
            { date: "2023-06-04", price: 202000 },
            { date: "2023-06-05", price: 200000 },
          ]
        },
        {
          name: "Trà Ô Long",
          prices: [
            { date: "2023-06-01", price: 240000 },
            { date: "2023-06-02", price: 250000 },
            { date: "2023-06-03", price: 255000 },
            { date: "2023-06-04", price: 252000 },
            { date: "2023-06-05", price: 250000 },
          ]
        },
      ]
    }
  ]
  
  export const calculateAverage = (prices: { date: string; price: number }[]) => {
    return prices.reduce((sum, { price }) => sum + price, 0) / prices.length;
  }
  
  export const formatPrice = (price: number) => {
    return price.toLocaleString() + ' VNĐ/kg';
  }