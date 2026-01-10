'use client';
import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { getImgUrl } from '../../utils/getImgUrl';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

const BookCard = ({ book }) => {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-xs transition-transform duration-300 hover:scale-105">
      
      {/* Book Image */}
      <Link to={`/books/${book._id}`}>
        <img
          src={getImgUrl(book?.coverImage)}
          alt={book?.title}
          className="w-full h-56 object-cover rounded-md mb-4"
        />
      </Link>

      {/* Book Info */}
      <Link to={`/books/${book._id}`}>
        <h3 className="text-lg font-semibold hover:text-blue-600 mb-2">
          {book?.title}
        </h3>
      </Link>

      <p className="text-gray-600 text-sm mb-3">
        {book?.description?.length > 80
          ? `${book.description.slice(0, 80)}...`
          : book?.description}
      </p>

      <p className="font-medium mb-4">
        ${book?.newPrice}
        <span className="line-through text-gray-400 ml-2">
          ${book?.oldPrice}
        </span>
      </p>

      <button
        onClick={() => dispatch(addToCart(book))}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <FiShoppingCart />
        <span>Add to Cart</span>
      </button>
    </div>
  );
};

export default BookCard;
