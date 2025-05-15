// const products = [
//   { id: 1, name: "Стол", description: "Деревянный стол", price: "15000₽" },
//   { id: 2, name: "Стул", description: "Мягкий стул", price: "5000₽" }
// ];

// export default products;


// whatsapp-bot/products.js
// module.exports = [
//   {
//     id: 1,
//     name: 'Стол',
//     price: '5000₽',
//     description: 'Деревянный стол, ручная работа',
//     image: 'https://bmmagazine.co.uk/wp-content/uploads/2024/04/shutterstock_2162719921-1536x1025.jpg'
//   },
//   {
//     id: 2,
//     name: 'Стул',
//     price: '2000₽',
//     description: 'Удобный деревянный стул',
//     image: 'https://bmmagazine.co.uk/wp-content/uploads/2024/04/shutterstock_2162719921-1536x1025.jpg'
//   },
//   {
//     id: 3,
//     name: 'Полка',
//     price: '1500₽',
//     description: 'Настенная полка для хранения',
//     image: 'https://bmmagazine.co.uk/wp-content/uploads/2024/04/shutterstock_2162719921-1536x1025.jpg'
//   }
// ];


// whatsapp-bot/products.js

const path = require('path');
module.exports = [
  {
    id: 1,
    name: 'Стол',
    price: '5000₽',
    description: 'Деревянный стол, ручная работа.',
    image: path.resolve(__dirname, './images/polot.webp')
  },
  {
    id: 2,
    name: 'Стул',
    price: '2000₽',
    description: 'Удобный деревянный стул с мягким сиденьем.',
    image: path.resolve(__dirname, './images/polot.webp')

  },
  {
    id: 3,
    name: 'Полка',
    price: '1500₽',
    description: 'Настенная полка из дуба.',
    image: path.resolve(__dirname, './images/polot.webp')
  }
];
