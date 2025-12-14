import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import BookCard from '../books/BookCard';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const Recommended = () => {
    const { data } = useFetchAllBooksQuery();
    const books = Array.isArray(data?.books) ? data.books : Array.isArray(data) ? data : [];

     // check what you actually get

    if (!books.length) return null; // optional: don't render anything if no books

    return (
        <div className='py-16'>
            <h2 className='text-3xl font-semibold mb-6'>Recommended for you</h2>

            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                navigation
                modules={[Pagination, Navigation]}
                breakpoints={{
                    640: { slidesPerView: 1, spaceBetween: 20 },
                    768: { slidesPerView: 2, spaceBetween: 40 },
                    1024: { slidesPerView: 2, spaceBetween: 50 },
                    1180: { slidesPerView: 3, spaceBetween: 50 },
                }}
                className="mySwiper"
            >
                {books.slice(0, 10).map((book, index) => (
                    <SwiperSlide key={book._id || index}>
                        <BookCard book={book} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Recommended;
