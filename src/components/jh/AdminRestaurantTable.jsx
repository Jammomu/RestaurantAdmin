import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';  // Modal 추가
import { deleteImage, deleteMenu, fetchRestaurantMenu, fetchRestaurants, getRestaurantImages, insertImage, insertMenu, searchRestaurants, setMainImage } from './api.js';
import { deleteRestaurant } from './api.js';
import Pagination from './Pagination';
import { useNavigate } from 'react-router-dom'; // navigate 사용
import SearchBar from './SearchBar.jsx';
import { v4 as uuidv4 } from 'uuid';  // uuid 라이브러리 임포트

const AdminRestaurantTable = () => {
  const [restaurants, setRestaurants] = useState([]);  // 레스토랑 목록 상태
  const [loading, setLoading] = useState(false);  // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const [totalPages, setTotalPages] = useState(1);  // 총 페이지 수
  const [showModal, setShowModal] = useState(false);  // Modal 표시 여부 상태
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);  // 선택된 레스토랑 정보
  const [searchParams, setSearchParams] = useState({
    query: '',               // 검색어
    searchOption: 'all',    // 검색 조건 (기본값: 도시)
    name: '',
    city: '',                // 도시
    district: '',            // 구
    neighborhood: '',        // 동
    foodType: '',            // 음식 종류
    parkingAvailable: '', // 주차 가능 여부
    reservationAvailable: '', // 예약 가능 여부
    page: 1,
    size: 24,
  });
  const [totalRestaurants, setTotalRestaurants] = useState(0);  // 총 레스토랑 수 상태
  const [searchTotal, setSearchTotal] = useState(0);  // 총 레스토랑 수 상태
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);  // 새 메뉴 입력 상태
  const [newMenu, setNewMenu] = useState({ name: '', price: '' }); // 새로운 메뉴 객체
  const [imageFile, setImageFile] = useState(null); // 이미지 파일 상태
  const [imageOrder, setImageOrder] = useState(true); // 이미지 순서 (기본 false로 설정)
  const [imagePreview, setImagePreview] = useState(''); // 이미지 미리보기 URL 상태
  // 현재 선택된 대표 이미지 ID
  const [selectedMainImageId, setSelectedMainImageId] = useState(null);

  // 레스토랑 데이터 가져오기
  const fetchRestaurantsData = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchRestaurants(page, 24);
      if (response.content) {
        setRestaurants(response.content);
        setTotalPages(response.totalPages);
        setTotalRestaurants(response.totalElements);  // 전체 레스토랑 수 업데이트
        setSearchTotal(response.totalElements);  // 전체 레스토랑 수 업데이트

      } else {
        setRestaurants([]);
        setTotalPages(1);
        setTotalRestaurants(0);  // 레스토랑이 없을 경우 0으로 설정

      }
    } catch (err) {
      console.error('레스토랑 목록을 가져오는 데 실패했습니다:', err);
      setError('레스토랑 목록을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

    // 메뉴 추가 함수
  const handleAddMenu = async () => {

    if (newMenu.name && newMenu.price) {
      const newMenuData = { name: newMenu.name, price: parseFloat(newMenu.price) };
      
      try {
        // 메뉴 추가 API 호출
        const response = await insertMenu(selectedRestaurant.restaurantId, newMenuData);

        if (response.status === 201) {
          // 메뉴 추가 후 레스토랑 메뉴 다시 가져오기
          const updatedMenuList = await fetchRestaurantMenu(selectedRestaurant.restaurantId);
          setMenu(updatedMenuList); // 메뉴 리스트 상태 업데이트
          
          // selectedRestaurant의 menuList도 업데이트
          setSelectedRestaurant(prevState => ({
            ...prevState,
            menuList: updatedMenuList,
          }));
          setNewMenu({ name: '', price: '' }); // 입력 필드 초기화
        }
      } catch (error) {
        console.error("메뉴 추가 실패:", error);
      }
    }
  };

  const handleDeleteMenu = async (menuId) => {
    const isConfirmed = window.confirm("삭제하시겠습니까?");
    if (!isConfirmed) return;
  try {
    const restaurantId = selectedRestaurant.restaurantId;

    // 메뉴 삭제 API 호출
    const response = await deleteMenu(restaurantId, menuId);

    if (response.status === 204) {
      // 메뉴 삭제 후, 메뉴 리스트 상태 업데이트
      const updatedMenuList = await fetchRestaurantMenu(restaurantId);
      // 상태 업데이트
   setSelectedRestaurant(prevState => {
    return {
      ...prevState,
      menuList: updatedMenuList, // 메뉴 리스트 갱신
    };
  });
      // 팝업에서 메뉴 삭제 후 바로 반영되도록 상태 갱신
      setMenu(updatedMenuList);
    }
  } catch (error) {
    console.error("메뉴 삭제 실패:", error.response?.data?.error || error.message);
  }
};

  
  const deleteRestaurantsData = async (restaurantId) => {
  const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
  if (!isConfirmed) return;

  try {
    // 레스토랑의 메뉴 삭제
    const menuList = await fetchRestaurantMenu(restaurantId);
    for (const menu of menuList) {
      await deleteMenu(restaurantId, menu.menuId); // 각 메뉴 삭제
    }

    // 레스토랑의 이미지 삭제
    const imageList = await getRestaurantImages(restaurantId);
    for (const image of imageList) {
      await deleteImage(restaurantId, image.imageId); // 각 이미지 삭제
    }

    // 레스토랑 삭제
    await deleteRestaurant(restaurantId);  // 레스토랑 삭제 API 호출

    // 레스토랑 목록에서 삭제된 레스토랑 제거
    setRestaurants((prevRestaurants) =>
      prevRestaurants.filter((restaurant) => restaurant.restaurantId !== restaurantId)
    );

    setShowModal(false);  // 레스토랑 삭제 후 Modal 닫기
    window.location.reload();  // 화면 새로고침
    window.alert("레스토랑과 관련된 모든 데이터가 삭제되었습니다.");
  } catch (error) {
    console.error('레스토랑 삭제 실패:', error.response?.data?.error || error.message);
    alert("레스토랑 삭제 중 오류가 발생했습니다.");
  }
};

 
  useEffect(() => {
    if (!searchParams.query) {
      fetchRestaurantsData(currentPage);  // 전체 레스토랑 페이지네이션
    } else {
      handleSearch(currentPage);  // 검색 시 페이지네이션 적용
    }
  }, [currentPage]);

  const handleEditClick = (restaurantId) => {
    navigate(`/restaurant/update/${restaurantId}`);
  };

  const handleAddClick = () => {
    navigate('/restaurant/add');
  };

// 페이지 변경 시 호출되는 함수
const handlePageChange = async (page) => {
  if(page === currentPage) return;

  setCurrentPage(page); // 현재 페이지 업데이트
  // 페이지네이션 후 스크롤을 맨 위로 이동
  window.scrollTo(0, 0);
};

  // 레스토랑을 클릭했을 때 Modal을 열고 해당 레스토랑 정보를 전달
  const handleRestaurantClick = async (restaurant) => {
    setSelectedRestaurant(restaurant);

    try {
      // 레스토랑의 메뉴 리스트를 가져옴
      const menuData = await fetchRestaurantMenu(restaurant.restaurantId);
      setMenu(menuData);  // 메뉴 리스트 상태 업데이트

      // 레스토랑의 이미지 리스트를 가져옴
      const imageData = await getRestaurantImages(restaurant.restaurantId);
      setSelectedRestaurant((prevState) => ({
        ...prevState,
        images: imageData, // 이미지 정보 저장
      }));

    } catch (error) {
       console.error("메뉴나 이미지를 가져오는 데 실패했습니다:", error);
      setError("메뉴 또는 이미지를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRestaurant(null);  // Modal 닫을 때 선택된 레스토랑 정보 초기화
    setImageFile(null);
    setImagePreview('');
  };

 // 이미지 업로드 (폼 데이터로 보내기)
 const handleImageUpload = async () => {
  if (!imageFile || !selectedRestaurant) {
    alert("이미지 파일을 선택해주세요!");
    return;
  }

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("imageOrder", imageOrder); // 이미지 순서
  formData.append("uid", uuidv4()); // 고유한 UUID 생성 후 전송

  try {
    // 이미지 업로드 API 호출
    const response = await insertImage(selectedRestaurant.restaurantId, formData);
    if (response.status === 201) {
      // 이미지 업로드 후 레스토랑 이미지 갱신
      const updatedImages = await getRestaurantImages(selectedRestaurant.restaurantId);
      setSelectedRestaurant((prevState) => ({
        ...prevState,
        images: updatedImages,
      }));
      
      // 업로드된 이미지들 출력 (배열로 되어 있기 때문에 각 이미지의 imageUrl을 출력)
      // updatedImages.forEach(image => {
      //   console.log("Image URL:", image.imageUrl); // 각 이미지의 URL 출력
      // });

      alert("이미지가 업로드되었습니다.");
      setImageFile(null); // 파일 초기화
      setImagePreview(''); // 미리보기 초기화
      
    }
  } catch (error) {
    console.error('이미지 업로드 실패:', error.response?.data || error.message);
    alert("이미지 업로드에 실패했습니다.");
  }
};


  // 이미지 삭제
const handleDeleteImage = async (imageId) => {
  const isConfirmed = window.confirm("이 이미지를 삭제하시겠습니까?");
  if (!isConfirmed) return;

  try {
    // 이미지 삭제 API 호출
    const response = await deleteImage(selectedRestaurant.restaurantId, imageId);

    if (response.status === 204) {
      // 삭제 후 이미지 리스트 갱신
      const updatedImages = await getRestaurantImages(selectedRestaurant.restaurantId);
      setSelectedRestaurant((prevState) => ({
        ...prevState,
        images: updatedImages,
      }));
      
    }
  } catch (error) {
    console.error("이미지 삭제 실패:", error);
  }
};

  // 이미지 파일 선택 시 미리보기 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 검색어 입력 시 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  // 체크박스 상태 업데이트
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: checked ? true : "",  // 체크되면 'true', 체크 해제되면 '' (비어있는 상태)
    }));
  };


  const handleFilterToggle = (filter) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [filter]: prevParams[filter] ? false : true,  // 기존 값이 true면 false로, 아니면 true로 변경
    }));
  };

  // 레스토랑 검색 API
const handleSearch = async (page = 1) => {

  setLoading(true);  // 로딩 시작
  setError(null);    // 이전 에러 초기화

  const { query, searchOption, parkingAvailable, reservationAvailable } = searchParams;

  const params = {
    page: page,
    size: 24,  // 페이지 크기
  };

  // 전체 조건 (query에 맞는 모든 조건으로 검색)
  if (query && searchOption === 'all') {
    params.query = query;  // 전체 검색
  } else {
    // 검색어 조건에 맞게 검색
    if (query) {
      if (searchOption === 'name') {
        params.name = query;  // 가게명 검색
      } else if (searchOption === 'city') {
        params.city = query;  // 도시 검색
      } else if (searchOption === 'district') {
        params.district = query;  // 구 검색
      } else if (searchOption === 'neighborhood') {
        params.neighborhood = query;  // 동 검색
      } else if (searchOption === 'foodType') {
        params.foodType = query;  // 음식 종류 검색
      }
    }
  }

  // 체크박스 필터링 (값이 비어있지 않으면 필터에 추가)
  if (parkingAvailable !== "") params.parkingAvailable = parkingAvailable;
  if (reservationAvailable !== "") params.reservationAvailable = reservationAvailable;

  try {
    // `searchRestaurants`를 사용하여 검색
    const response = await searchRestaurants(params);

    if (response.content) {
      setRestaurants(response.content);  // 검색된 레스토랑 목록 업데이트
      setTotalPages(response.totalPages);  // 총 페이지 수 설정
      setSearchTotal(response.totalElements);  // 전체 레스토랑 수 업데이트
    } else {
      setRestaurants([]);
      setTotalPages(1);
      setSearchTotal(0);
    }
  } catch (err) {
    console.error('검색 오류:', err);
    setError('검색 중 오류가 발생했습니다.');
  } finally {
    setLoading(false);  // 로딩 종료
  }
};

  // 전체 목록 보기
  const handleViewAll = () => {
     setSearchParams({
      query: '',
      searchOption: 'name',
      name: '',
      city: '',
      district: '',
      neighborhood: '',
      foodType: '',
      parkingAvailable: false,
      reservationAvailable: false,
      page: 1,
      size: 24,
    });
    setCurrentPage(1);
    fetchRestaurantsData(1);
  };

// 이미지 클릭 시 대표 이미지로 설정
const handleSetAsMainImage = async (imageId) => {
  // 이전 대표 이미지 해제
  const updatedImages = selectedRestaurant.images.map((image) => {
    if (image.imageId === imageId) {
      return { ...image, imageOrder: true }; // 대표 이미지로 설정
    } else {
      return { ...image, imageOrder: false }; // 기존 대표 이미지는 해제
    }
  });

  // 업데이트된 이미지 배열을 레스토랑 데이터에 반영
  setSelectedRestaurant((prevState) => ({
    ...prevState,
    images: updatedImages,
  }));

  // 대표 이미지 ID 저장
  setSelectedMainImageId(imageId);

   // 이미지 정보를 서버에 반영
    const imageDTO = {
      restaurantId: selectedRestaurant.restaurantId,
      imageId: imageId,
      imageOrder: true, // 대표 이미지로 설정
    };

    try {
      const responseMessage = await setMainImage(selectedRestaurant.restaurantId, imageDTO);
      alert(responseMessage);  // "대표 이미지가 설정되었습니다." 메시지 출력
    } catch (error) {
      alert("대표 이미지 설정에 실패했습니다.");
      console.error("대표 이미지 설정 실패:", error);
    }
};

  // 이미지 리스트 렌더링 함수
const renderImageList = () => {
  return selectedRestaurant?.images && selectedRestaurant.images.length > 0 ? (
    selectedRestaurant.images.map((image) => (
      <li key={image.imageId} style={{ display: 'inline-block', marginRight: '10px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={image.imageUrl}
            alt="이미지"
            style={{
              maxWidth: '100px',
              marginRight: '10px',
              cursor: 'pointer',
              border: image.imageOrder ? '3px solid #007bff' : 'none', // 대표 이미지일 경우 파란 테두리
              borderRadius: '5px',  // 이미지 모서리 둥글게 처리 (옵션)
            }}
            onClick={() => handleSetAsMainImage(image.imageId)}  // 클릭하면 대표 이미지로 설정
          />
          
          {/* 대표 이미지일 경우 뱃지 추가 */}
          {image.imageOrder && (
            <span
              style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                backgroundColor: '#007bff',
                color: '#fff',
                padding: '3px 5px',
                borderRadius: '5px',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              대표 이미지
            </span>
          )}
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDeleteImage(image.imageId)}
        >
          삭제
        </Button>
      </li>
    ))
  ) : (
    <p>이미지가 없습니다.</p>
  );
};

  return (
    <Container fluid>
      {/* <h2>레스토랑 목록</h2> */}
      <h1 className="js-admin-title">레스토랑 관리</h1>
        <SearchBar
        searchParams={searchParams}
        handleInputChange={handleInputChange}
        handleFilterToggle={handleFilterToggle}
        handleSearch={handleSearch}
        />
      <Row className="align-items-center mt-4">
        
        <Col><div className="mb-3">
      <strong>'{searchParams.query || '전체'}' {searchTotal}개의 레스토랑</strong>
    </div></Col>
        <Col className="d-flex justify-content-end mb-3">
          <Button variant="secondary" onClick={handleViewAll}>전체 목록 보기</Button>
        </Col>
      </Row>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>주소</th>
            <th>음식 종류</th>
            <th>주차 가능</th>
            <th>예약 가능</th>
            <th>전화번호</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
            <tr key={restaurant.restaurantId} onClick={() => handleRestaurantClick(restaurant)}>
              <td>{restaurant.restaurantId}</td>
              <td>{restaurant.name}</td>
              <td>
                {restaurant.roadAddr || restaurant.jibunAddr} {restaurant.detailAddr}
              </td>
              <td>{restaurant.foodType}</td>
              <td>{restaurant.parkingAvailable ? '가능' : '불가능'}</td>
              <td>{restaurant.reservationAvailable ? '가능' : '불가능'}</td>
              <td>{restaurant.phone}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 레스토랑 등록 버튼 */}
      <div className="d-flex justify-content-end mt-3">
        <Button variant="primary" onClick={handleAddClick}>
          레스토랑 등록
        </Button>
      </div>
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
      {/* Modal로 레스토랑 상세 정보 표시 */}
      {selectedRestaurant && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedRestaurant.name} 상세 정보</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>이름:</strong> {selectedRestaurant.name}</p>
            <p><strong>주소:</strong> {selectedRestaurant.roadAddr || selectedRestaurant.jibunAddr} {selectedRestaurant.detailAddr}</p>
            <p><strong>음식 종류:</strong> {selectedRestaurant.foodType}</p>
            <p><strong>전화번호:</strong> {selectedRestaurant.phone}</p>
           <div className='mb-3'>
            <span 
              style={{marginRight:'10px'}}
              className={`badge ${selectedRestaurant.reservationAvailable ? 'bg-primary' : 'bg-danger'} px-2 py-2`}
            >
              {selectedRestaurant.reservationAvailable ? '예약가능' : '예약불가'}
            </span>
            <span 
                className={`badge ${selectedRestaurant.parkingAvailable ? 'bg-primary' : 'bg-danger'} px-2 py-2`}
              >
                {selectedRestaurant.parkingAvailable ? '주차가능' : '주차불가'}
              </span>
            </div>
          <Form>
              <Form.Group>
                <Form.Label>이미지 파일</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </Form.Group>
              {imagePreview && (
                <div className="mt-3">
                  <img src={imagePreview} alt="미리보기" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                </div>
              )}
              {/* <Form.Check
                type="checkbox"
                label="첫 번째 이미지로 설정"
                checked={imageOrder}
                onChange={(e) => setImageOrder(e.target.checked)}
                className="mt-3"
              /> */}
              <Button variant="success" onClick={handleImageUpload} className="mt-3">
                이미지 업로드
              </Button>
            </Form>

            <h5 className="mt-3">이미지 리스트</h5>
            {/* 레스토랑 이미지 목록을 출력 */}
            <ul>
            {renderImageList()}
          </ul>


            {/* 메뉴 추가 폼 */}
            <Row>
              <Col>
              <Form.Control
              type="text"
              placeholder="메뉴 명"
              value={newMenu.name}
              onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
            />
              </Col>
              <Col>
              <Form.Control
              type="number"
              placeholder="메뉴 가격"
              value={newMenu.price}
              onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
            />
              </Col>
              <Col>
              <Button variant="success" onClick={handleAddMenu}>추가</Button>
              </Col>
            </Row>
            
           

            <h5 className="mt-3">메뉴 리스트</h5>
            <ul>
              {menu.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.price}원
                  <Button
                    variant="danger"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleDeleteMenu(item.menuId)}
                  >
                    삭제
                  </Button>
                </li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="warning" onClick={() => handleEditClick(selectedRestaurant.restaurantId)}>
                  수정
                </Button>{' '}
                <Button variant="danger" onClick={() => deleteRestaurantsData(selectedRestaurant.restaurantId)}>
                  삭제
                </Button>
            <Button variant="secondary" onClick={handleCloseModal}>
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default AdminRestaurantTable;
