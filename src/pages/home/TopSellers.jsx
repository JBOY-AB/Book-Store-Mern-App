import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import BookCard from '../books/BookCard';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const categories = ["Choose a genre", "Business", "Fiction", "Horror", "Adventure"];

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");
  const { data: books = [] } = useFetchAllBooksQuery();

  console.log("Books fetched:", books);

  const filteredBooks =
    selectedCategory === "Choose a genre"
      ? books
      : books.filter(
          (book) =>
            book.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-6">Top Sellers</h2>

        <div className="mb-8">
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {filteredBooks.length === 0 ? (
          <p>No books found</p>
        ) : (
          <Swiper
            spaceBetween={30}
            navigation={true}
            allowSlidePrev={true}
            allowSlideNext={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            modules={[Pagination, Navigation]}
          >
            {filteredBooks.map((book) => (
              <SwiperSlide key={book._id} className="flex justify-center">
                <BookCard book={book} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default TopSellers;  


