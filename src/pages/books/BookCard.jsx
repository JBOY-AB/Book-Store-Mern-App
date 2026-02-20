import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { getImgUrl } from '../../utils/getImgUrl';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

const BookCard = ({ book }) => {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full transition-transform duration-300 hover:shadow-lg h-full">
      <div className="flex flex-col sm:flex-row gap-6 h-full">
        {/* Book Image - Left Side */}
        <div className="sm:w-1/2 flex-shrink-0">
          <Link to={`/books/${book._id}`}>
            <img
              src={getImgUrl(book?.coverImage)}
              alt={book?.title}
              className="w-full h-80 sm:h-72 object-cover rounded-md"
            />
          </Link>
        </div>

        {/* Book Info - Right Side */}
        <div className="sm:w-1/2 flex flex-col justify-between">
          <div>
            <Link to={`/books/${book._id}`}>
              <h3 className="text-lg font-semibold hover:text-blue-600 mb-3 line-clamp-2">
                {book?.title}
              </h3>
            </Link>

            <p className="text-gray-600 text-base mb-4 line-clamp-5">
              {book?.description?.length > 150
                ? `${book.description.slice(0, 150)}...`
                : book?.description}
            </p>
          </div>

          <div className="mt-auto">
            <p className="font-medium text-xl mb-4">
              ${book?.newPrice}
              {book?.oldPrice && (
                <span className="line-through text-gray-400 ml-2 text-base">
                  ${book?.oldPrice}
                </span>
              )}
            </p>

            <button
              onClick={() => dispatch(addToCart(book))}
              className="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3 text-base"
            >
              <FiShoppingCart className="text-lg" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;  

