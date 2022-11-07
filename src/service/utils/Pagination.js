const generatePagesArray = (currentPage, collectionLength, rowsPerPage, paginationRange) =>
{
    let pages = [];
    let totalPages = Math.ceil(collectionLength / rowsPerPage);
    let halfWay = Math.ceil(paginationRange / 2);
    let position;

    // console.log(`collectionLength ${collectionLength}`)
    // console.log(`rowsPerPage ${rowsPerPage}`)
    // console.log(`halfway ${halfWay}`)
    // console.log(`totalPages ${totalPages}`)
    if (currentPage <= halfWay) {
        position = 'start';
    } else if ((totalPages - halfWay) < currentPage) {
        position = 'end';
    } else {
        position = 'middle';
    }
    // console.log(position)

    let ellipsesNeeded = paginationRange < totalPages;
    let i = 1;
    while (i <= totalPages && i <= paginationRange) {
        let pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);
        let openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
        let closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));
        if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
            pages.push('...');
        } else {
            pages.push(pageNumber);
        }
        i ++;
    }
    return pages;
}

const calculatePageNumber = (i, currentPage, paginationRange, totalPages) =>
{
    var halfWay = Math.ceil(paginationRange/2);
    if (i === paginationRange) {
        return totalPages;
    } else if (i === 1) {
        return i;
    } else if (paginationRange < totalPages) {
        if (totalPages - halfWay < currentPage) {
            return totalPages - paginationRange + i;
        } else if (halfWay < currentPage) {
            return currentPage - halfWay + i;
        } else {
            return i;
        }
    } else {
        return i;
    }
}

const checkEmptyPage = (data) => {
    return data.length === 0;
}

export {
    generatePagesArray,
    checkEmptyPage
}