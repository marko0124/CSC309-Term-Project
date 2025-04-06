import Pagination from 'react-bootstrap/Pagination';

const PaginationButtons = ({ searchParams, setSearchParams, count, limit }) => {
  const page = parseInt(searchParams.get("page")) || 1;

  const handleFirst = () => {
    searchParams.delete("page");
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  }

  const handlePrev2 = () => {
    searchParams.set("page", page - 2);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  }

  const handlePrev = () => {
    searchParams.set("page", page - 1);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  }

  const handleNext = () => {
    searchParams.set("page", page + 1);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  }

  const handleNext2 = () => {
    searchParams.set("page", page + 2);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  }

  const handleLast = () => {
    searchParams.set("page", Math.ceil(count / limit));
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  }
  
  return (
    <Pagination>
      <Pagination.First onClick={handleFirst}/> 
      { page > 1 && <Pagination.Prev onClick={handlePrev}/>}

      { page > 2 && <Pagination.Item onClick={handlePrev2}>{page - 2}</Pagination.Item> }
      { page > 1 && <Pagination.Item onClick={handlePrev}>{page - 1}</Pagination.Item> }
      
      <Pagination.Item active>{page}</Pagination.Item>
      
      { page < Math.ceil(count / limit) && <Pagination.Item onClick={handleNext}>{page + 1}</Pagination.Item> }
      { page + 1 < Math.ceil(count / limit) && <Pagination.Item onClick={handleNext2}>{page + 2}</Pagination.Item> }

      { page < Math.ceil(count / limit) && <Pagination.Next onClick={handleNext}/> }
      <Pagination.Last onClick={handleLast}/>
    </Pagination>
  );
}

export default PaginationButtons;