import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';


const SearchBar = ({ searchParams, handleInputChange, handleFilterToggle, handleSearch }) => {
  // 검색 폼 제출을 막는 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // form 제출 기본 동작을 막음
    handleSearch(1);  // 검색 버튼 클릭 시 검색 실행
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4"> {/* 폼 제출 시 handleSubmit 호출 */}
      {/* 검색 조건과 검색어 입력 */}
      <Row className="align-items-center">
      <Col className='d-flex justify-content-center'>
          <Form.Group controlId="formQuery">
            {/* <Form.Label>검색어</Form.Label> */}
            <Form.Control
              type="text"
              placeholder="검색어 입력 (예: 음식, 도시 등)"
              name="query"
              value={searchParams.query || ''} // 기본값 설정
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="button-search">
            검색
          </Button>
        </Col>
      </Row>
        <Col>
         {/* 검색 조건 (버튼 그룹) */}
          <Form.Group controlId="formSearchOption">
            <div className="mt-3 text-center">
            {/* <Form.Label className='me-3'>검색 조건</Form.Label> */}
              <Button 
                variant={searchParams.searchOption === 'all' ? 'danger' : 'outline-danger'} 
                name="searchOption" 
                value="all" 
                className='me-2'
                size="sm"  // 버튼 크기 작게
                style={{ borderRadius: '50px', padding: '5px 15px' }}
                onClick={handleInputChange}
              >
                전체
              </Button>
              <Button 
                variant={searchParams.searchOption === 'name' ? 'danger' : 'outline-danger'} 
                name="searchOption" 
                value="name" 
                className='me-2'
                size="sm"  // 버튼 크기 작게
                style={{ borderRadius: '50px', padding: '5px 15px' }}
                onClick={handleInputChange}
              >
                가게명
              </Button>
              <Button 
                variant={searchParams.searchOption === 'city' ? 'danger' : 'outline-danger'} 
                name="searchOption" 
                value="city" 
                className='me-2'
                size="sm"  // 버튼 크기 작게
                style={{ borderRadius: '50px', padding: '5px 15px' }}
                onClick={handleInputChange}
              >
                도시
              </Button>
              <Button 
                variant={searchParams.searchOption === 'district' ? 'danger' : 'outline-danger'} 
                name="searchOption" 
                value="district" 
                className='me-2'
                size="sm"  // 버튼 크기 작게
                style={{ borderRadius: '50px', padding: '5px 15px' }}
                onClick={handleInputChange}
              >
                구
              </Button>
              <Button 
                variant={searchParams.searchOption === 'neighborhood' ? 'danger' : 'outline-danger'} 
                name="searchOption" 
                value="neighborhood" 
                className='me-2'
                size="sm"  // 버튼 크기 작게
                style={{ borderRadius: '50px', padding: '5px 15px' }}
                onClick={handleInputChange}
              >
                동
              </Button>
              <Button 
                variant={searchParams.searchOption === 'foodType' ? 'danger' : 'outline-danger'} 
                name="searchOption" 
                value="foodType" 
                className='me-2'
                size="sm"  // 버튼 크기 작게
                style={{ borderRadius: '50px', padding: '5px 15px' }}
                onClick={handleInputChange}
              >
                음식 종류
              </Button>
            </div>
          </Form.Group>
        </Col>
      

        <Row className="align-items-center mt-3 text-center">
          <Col>
            <Button
              className='me-2'
              variant={searchParams.reservationAvailable ? 'secondary' : 'outline-secondary'}
              size="sm"  // 버튼 크기 작게
                style={{ borderRadius: '50px', padding: '5px 15px' }}
              onClick={() => handleFilterToggle('reservationAvailable')}
            >
              예약 가능
            </Button>
            <Button
              className='me-2'
              variant={searchParams.parkingAvailable ? 'secondary' : 'outline-secondary'}
              size="sm"  // 버튼 크기 작게
                style={{ borderRadius: '50px', padding: '5px 15px' }}
              onClick={() => handleFilterToggle('parkingAvailable')}
            >
              주차 가능
            </Button>
          </Col>
        </Row>
    </Form>
  );
};

export default SearchBar;
