import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import Pagination from '../jh/Pagination';
import tokenStore from '../../store/tokenStore';
import "../../css/Review.css";

const apiUrl = process.env.REACT_APP_API_BASE_URL;

// 레스토랑 검색 및 전체 검색 API 통합
export const searchRestaurants = async (searchParams) => {
  try {
    // 쿼리 문자열 생성
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = `${apiUrl}/api/restaurant/search?${queryString}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('레스토랑 검색에 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw new Error('레스토랑 검색에 실패했습니다.');
  }
};

function AdminReview() {
  const [restaurant, setRestaurant] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const token = tokenStore((state) => state.token);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isHighOrder, setIsHighOrder] = useState(true); // true: 내림차순, false: 오름차순
  const [searchTotal, setSearchTotal] = useState(0);  // 총 레스토랑 수 상태
  const [searchParams, setSearchParams] = useState({
    query: '',               // 검색어
    searchOption: 'all',    // 검색 조건 (기본값: 도시)
    page: 1,
    size: 24,
  });

  const navigate = useNavigate(); 

  const fetchRestaurants = async (page = 1, keyword = '', order = 'desc') => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 20,
        keyword,
        order,
      };
      const response = await searchRestaurants(params);
      setRestaurant(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("가게 정보를 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

const handleSearch = async (page = 1) => {
  setLoading(true);  // 로딩 시작

  const { query, searchOption } = searchParams;

  const params = {
    ...searchParams,
    page: currentPage,
    query: searchParams.query || keyword,
  };

  try {
    const response = await searchRestaurants(params);
    setRestaurant(response.content || []);
    setTotalPages(response.totalPages);
    setSearchTotal(response.totalElements);
  } catch (err) {
    console.error('검색 오류:', err);
  } finally {
    setLoading(false);
  }
};

  const handlePageChange = async (page) => {
    if (page === currentPage) return;
    setCurrentPage(page); // 현재 페이지 업데이트
    fetchRestaurants(page, keyword); // 페이지 변경 시 검색어 유지
    window.scrollTo(0, 0);
  };

  const handleReviewClick = (restaurantId) => {
    navigate(`/reviewList/${restaurantId}`);
  };

  const handleReportClick = (restaurantId) => {
    navigate(`/report/${restaurantId}`);
  };

  const handleRatingSort = () => {
    const newOrder = !isHighOrder; // 현재 상태 반전
    setIsHighOrder(newOrder);
    fetchRestaurants(1, keyword, newOrder ? "desc" : "asc");
  };

  useEffect(() => {
    fetchRestaurants(currentPage, keyword); // 페이지 변경 시 검색어로 검색
  }, [currentPage]);

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <h1 className="js-admin-title">리뷰 관리</h1>
          <Form className="js-form d-flex justify-content-center mb-4">
            <Form.Control
              type="text"
              placeholder="키워드로 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={handleSearch}
              className="ms-2 button-search"
            >
              검색
            </Button>
          </Form>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden"></span>
              </div>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-header">
                <div>가게번호</div>
                <div>가게명</div>
                <div onClick={handleRatingSort}>
                  {isHighOrder ? "별점 높은순" : "별점 낮은순"}
                </div>
                <div>주소</div>
                <div>전화번호</div>
                <div>관리</div>
              </div>
              <div className="table-body">
                {restaurant.length > 0 ? (
                  restaurant.map((item) => (
                    <div key={item.restaurantId} className="table-row">
                      <div>{item.restaurantId}</div>
                      <div>{item.name}</div>
                      <div>{item.averageRating || 'N/A'}</div>
                      <div>{item.roadAddr || item.jibunAddr || 'N/A'}</div>
                      <div>{item.phone || 'N/A'}</div>
                      <div className="button-group">
                        <Button
                          variant="primary"
                          className="mb-2"
                          onClick={() => handleReviewClick(item.restaurantId)}
                        >
                          리뷰관리
                        </Button>
                        <Button variant="danger"
                          onClick={() => handleReportClick(item.restaurantId)}
                        >
                          신고관리
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data">데이터가 없습니다.</div>
                )}
              </div>
            </div>
          )}

          {/* 페이지네이션 */}
          <div className="pagination d-flex align-items-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminReview;
