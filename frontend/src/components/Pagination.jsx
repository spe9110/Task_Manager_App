import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaAnglesLeft } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { FaAnglesRight } from "react-icons/fa6";


function Pagination({ itemCount, pageSize, currentPage, onPageChange }) {
    // Initialize useSearchParams
    const [searchParams, setSearchParams] = useSearchParams();
    // calculate the total number of page 
    const pageCount = Math.ceil(itemCount / pageSize);
    // When the pagecount is 1 or less no need to render a pagination, return null
    if(pageCount <= 1){
        return null
    }

    // change the page
    const changePage = page => {
        searchParams.set('page', page.toString())
        setSearchParams(searchParams)
    }
  return (
    <div className='flex justify-center items-center gap-2 mt-6'>
        <div className='number_of_page'>
            <p>Page {currentPage} of {pageCount}</p>
        </div>
        <div className='buttons flex justify-center items-center gap-2'>
            <button className='cursor-pointer bg-neutral-300 rounded-md p-[8px]' disabled={currentPage === 1} onClick={() => changePage(1)}>
                <FaAnglesLeft />
            </button>
            <button className='cursor-pointer bg-neutral-300 rounded-md p-[8px]' disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
                <FaAngleLeft />
            </button>
            <button className='cursor-pointer bg-neutral-300 rounded-md p-[8px]' disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)}>
                <FaAngleRight />
            </button>
            <button className='cursor-pointer bg-neutral-300 rounded-md p-[8px]' disabled={currentPage === pageCount} onClick={() => changePage(pageCount)}>
                <FaAnglesRight />
            </button>
        </div>
    </div>
  )
}

export default Pagination