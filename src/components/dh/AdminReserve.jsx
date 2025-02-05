import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Col, Row } from 'react-bootstrap';
import {  useNavigate } from 'react-router-dom';
import PaginationComponent from 'components/PaginationComponent'; 
import usePaginationStore from 'store/usePaginationStore';
import { restaurantStore } from 'store/restaurantStore';

const AdminReserve = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigator = useNavigate();
  const { currentPage, setCurrentPage, setTotalPages, pageGroup } = usePaginationStore();
  const itemsPerPage = 8;
  const itemsPerGroup = 40;
  const {setRestaurant} = restaurantStore();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/restaurants?name=${searchTerm}&page=${pageGroup}&size=${itemsPerGroup}`
      );
      const data = await response.json();
      setRestaurants(data.list);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      console.error('레스토랑 데이터 가져오기 오류:', error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [pageGroup, searchTerm]);

  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    fetchRestaurants();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const currentRestaurants = restaurants.slice(
    ((currentPage - 1) % 5) * itemsPerPage, 
    ((currentPage - 1) % 5 + 1) * itemsPerPage
  );


  const selectRestaurants= (restaurants) =>{
    setRestaurant(restaurants);
    navigator("/manager-reservations/reservations")
  } ;

  return (
    <Container fluid>
      <h1 className="js-admin-title">레스토랑 예약 관리</h1>
      
      <Form className="mb-3" onSubmit={handleSearch}>
        <Row className="align-items-center">
          <Col className='d-flex justify-content-center mb-2'>
            <Form.Control
              type="text"
              placeholder="레스토랑 이름 입력"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary" type="submit" className="button-search">
              검색
            </Button>
          </Col>
        </Row>
      </Form>

      {currentRestaurants.length > 0 && (
        <Table striped bordered hover className="mb-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>도로명 주소</th>
              <th>지번 주소</th>
              <th>상세 주소</th>
              <th>예약 관리</th>
            </tr>
          </thead>
          <tbody>
            {currentRestaurants.map((restaurant) => (
              <tr key={restaurant.restaurantId}>
                <td>{restaurant.restaurantId}</td>
                <td>{restaurant.name}</td>
                <td>{restaurant.phone}</td>
                <td>{restaurant.roadAddr}</td>
                <td>{restaurant.jibunAddr}</td>
                <td>{restaurant.detailAddr}</td>
                <td>
                    <Button variant="info" size="sm" onClick={() => selectRestaurants(restaurant)}>예약 관리</Button>

                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <PaginationComponent onPageChange={handlePageChange} />
    </Container>
  );
};

export default AdminReserve;

