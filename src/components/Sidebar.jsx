import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // React Router를 사용하여 페이지 이동을 처리
import '../css/App.css'; // 스타일 적용
import tokenStore from 'store/tokenStore';

const Sidebar = () => { // React Router의 useNavigate 훅 사용
  const {isTokenValid, setIsTokenValid} = tokenStore(); // 토큰 유효성 체크 상태

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const token = sessionStorage.getItem('token') || urlParams.get('token');

  //   if (token) {
  //     // 세션 스토리지에 토큰 저장
  //     setIsTokenValid(true);
  //     sessionStorage.setItem('token', token);
  //     console.log('토큰이 세션에 저장되었습니다:', token);
  //      // 토큰이 유효하면 상태 업데이트
  //   } else {
  //     console.log("리렌더링 횟수");
  //     // 토큰이 없으면 리다이렉션
  //     window.location.href = 'http://localhost:3000';
  //     setIsTokenValid(false); // 토큰이 없으면 상태 업데이트
  //   }
  // }, []);

  // // 토큰 유효성 검사 완료되기 전에 렌더링되지 않도록
  // if (isTokenValid === null) {
  //   return null; // 상태 값이 결정되기 전에는 아무것도 렌더링하지 않음
  // }

  return (
        
    // isTokenValid ? (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* 브랜드 링크 */}
      <a href="/" className="brand-link">
        <img
          src="https://adminlte.io/themes/v3/dist/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
        />
        <span className="brand-text font-weight-light">AdminLTE</span>
      </a>

      <div className="sidebar">
        {/* 사용자 패널 */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src="https://adminlte.io/themes/v3/dist/img/user2-160x160.jpg"
              className="img-circle elevation-2"
              alt="User"
            />
          </div>
          <div className="info">
            <Link to="/" className="d-block">User Name</Link>
          </div>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            {/* 회원 관리 */}
            <li className="nav-item">
              <Link to="/manage-users" className="nav-link">
                <i className="nav-icon fas fa-users" />
                <p>회원 관리</p>
              </Link>
            </li>
            {/* 레스토랑 관리 */}
            <li className="nav-item">
              <Link to="/manage-restaurants" className="nav-link">
                <i className="nav-icon fas fa-store" />
                <p>레스토랑 관리</p>
              </Link>
            </li>
            {/* 예약 관리 */}
            <li className="nav-item">
              <Link to="/manage-reservations" className="nav-link">
                <i className="nav-icon fas fa-calendar-check" />
                <p>예약 관리</p>
              </Link>
            </li>
            {/* 리뷰 관리 */}
            <li className="nav-item">
              <Link to="/manage-reviews" className="nav-link">
                <i className="nav-icon fas fa-comments" />
                <p>리뷰 관리</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
    // ) : null // 
  );
};

export default Sidebar;
