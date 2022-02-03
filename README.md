# Book Manager

Note: Currently under development, potential bugs

The Book Manager is used to manage, track and note your reading progress during your academic endeavours. I created this program for 
2 reasons:
- To track my reading progress, because I prefer to read to learn programming concepts. 
- To practice my JavaScript and VueJS abilities. 

This application was written using Vue 2.0 rather than Vue 3.0. This is 
because I wanted to use a component library called Vuesax, however this does not support Vue 3.0 yet. The conversion to Vue 3.0
is not a huge effort, so when Vuesax for Vue 3.0 is available, I shall convert the code over to Vue 3.0. 

## Features
Features include:
- Automatic addition of book data, just search the book name and pick from the search results, and click to see a preview! See figure 1
- Beautiful pinterest-esque stacking book cards in the Card View. See figure 2
- Efficient Tabular View for managing and editing several books at once. See figure 3
- Category View for the Card View is too disorganised. See figure 4
- Bookmarking, personal star rating, and note taking with a rich text editor! See figure 5
- Statistics to analyse your reading habits and your libraries growth. See figure 6
- Fully customizable accent colour, and a crisp light mode available. See figure 7 and 8
- Finally, for those obscure books that aren't documented by the Google Books API, you can manually input their details

## Project setup
Using npm:
```
npm install
```
Using Yarn:
```
yarn install
```

### Compiles and hot-reloads for development
Using npm:
```
npm run electron:serve
```
Using Yarn:
```
yarn electron:serve
```

### Compiles and minifies for production
Using npm:
```
npm run electron:build
```
Using Yarn:
```
yarn electron:build
```

Once built, go to dist_electron, and run the "Book Manager Setup 0.1.0" installer. 

## Figures

### Figure 1
Auto add book, with search 
![1](https://user-images.githubusercontent.com/36010516/152333241-276442c4-e24f-4cff-b724-b761eb9306d0.png)

### Figure 2
Card View of Library
![2](https://user-images.githubusercontent.com/36010516/152333249-3d73cedd-d48e-4c5b-9b9e-92e51e2709dc.png)

### Figure 3
Tabular View of Library
![3](https://user-images.githubusercontent.com/36010516/152333262-7c1eaf1c-5cf8-4860-8ad9-a4ca1628082c.png)

### Figure 4
Category View of Library
![4](https://user-images.githubusercontent.com/36010516/152333346-aabf28bf-7f7b-4b59-bba9-304a06a8b6c1.png)

### Figure 5
Book details, with rich text notes and bookmark
![5](https://user-images.githubusercontent.com/36010516/152333349-90c9fbb5-a542-4eff-a4d8-6c8545154b81.png)

### Figure 6
Library statistics
![6](https://user-images.githubusercontent.com/36010516/152333360-7147142e-e24a-4bd7-8dd3-5591eb6cacfc.png)

### Figure 7
Settings and customization
![7](https://user-images.githubusercontent.com/36010516/152333365-72545516-14f0-4efd-bfe2-26e38a224d9c.png)

### Figure 8
Light mode example
![8](https://user-images.githubusercontent.com/36010516/152333373-89c5d12a-cc56-4fb6-b581-2f528331a49d.png)


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Contact me for general enqueries here: leytonodayabc123@gmail.com
