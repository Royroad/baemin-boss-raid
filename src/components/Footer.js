/**
 * Footer 컴포넌트
 * 연락처 정보와 제안 안내 메시지를 표시
 */
const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-4">
      <div className="container">
        {/* 제안 안내 메시지 */}
        <div className="footer-suggestion-note">
          <small className="text-light">
            💡 라이더님의 안전한 레이드를 기원합니다
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 