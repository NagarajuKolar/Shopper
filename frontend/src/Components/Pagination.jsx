import React from 'react'
import { useState } from 'react';
import '../CSS/Pagination.css'

function Pagination({ pageSize, totalProducts, currentPage, onPageChange, }) {
    const totalPages = Math.ceil(totalProducts / pageSize)
    return (
        <>
            <div className="page-container">
                <button disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)}>◀️ </button>

                {[...Array(totalPages).keys()].map((n) => (
                    <button key={n} className={currentPage === n ? "page-active" : ""}
                        onClick={() => onPageChange(n)}>{n + 1}
                    </button>
                ))}

                <button disabled={currentPage === totalPages - 1} onClick={() => onPageChange(currentPage + 1)}>▶️</button>
            </div>




        </>
    )
}

export default Pagination