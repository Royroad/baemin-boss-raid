/**
 * 레이드 참여 모달 컴포넌트
 * 라이더 ID 입력 및 참여 처리
 */

import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { joinRaid } from '../services/raidService';
import './RaidJoinModal.css';

const RaidJoinModal = ({ show, onHide, raidId, raidName, onJoinSuccess }) => {
  const [riderId, setRiderId] = useState('');
  const [riderName, setRiderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 라이더 ID 형식 검증
  const validateRiderId = (id) => {
    const pattern = /^BC\d{6}$/;
    return pattern.test(id);
  };
  
  // 참여 처리
  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // 유효성 검증
    if (!riderId.trim()) {
      setError('라이더 ID를 입력해주세요.');
      return;
    }
    
    if (!validateRiderId(riderId)) {
      setError('올바른 라이더 ID 형식이 아닙니다. (BC + 6자리 숫자)');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await joinRaid(raidId, riderId, riderName || null);
      
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          onHide();
          if (onJoinSuccess) {
            onJoinSuccess(result.data);
          }
          // 상태 초기화
          setRiderId('');
          setRiderName('');
          setSuccess('');
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('참여 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 모달 닫기 시 초기화
  const handleClose = () => {
    setRiderId('');
    setRiderName('');
    setError('');
    setSuccess('');
    onHide();
  };
  
  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      centered
      className="raid-join-modal"
    >
      <Modal.Header closeButton className="raid-modal-header">
        <Modal.Title>⚔️ 레이드 참여</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="raid-modal-body">
        <div className="raid-info-box">
          <h5>{raidName}</h5>
          <p>레이드에 참여하여 보스를 토벌하세요!</p>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleJoin}>
          <Form.Group className="mb-3">
            <Form.Label>라이더 ID *</Form.Label>
            <Form.Control
              type="text"
              placeholder="BC123456"
              value={riderId}
              onChange={(e) => setRiderId(e.target.value.toUpperCase())}
              maxLength={8}
              disabled={isLoading || success}
              className="raid-input"
            />
            <Form.Text className="text-muted">
              BC로 시작하는 6자리 숫자를 입력하세요
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>라이더 이름 (선택)</Form.Label>
            <Form.Control
              type="text"
              placeholder="김배민"
              value={riderName}
              onChange={(e) => setRiderName(e.target.value)}
              maxLength={50}
              disabled={isLoading || success}
              className="raid-input"
            />
          </Form.Group>
          
          <div className="modal-actions">
            <Button 
              variant="secondary" 
              onClick={handleClose}
              disabled={isLoading || success}
            >
              취소
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isLoading || success}
              className="btn-raid-join"
            >
              {isLoading ? '참여 중...' : '참여하기'}
            </Button>
          </div>
        </Form>
        
        <div className="raid-join-notice">
          <p>💡 <strong>참여 안내</strong></p>
          <ul>
            <li>레이드 참여 후 해당 구역에서 배달 시 데미지가 집계됩니다</li>
            <li>우천 또는 할증 배달 시 데미지가 2배로 적용됩니다</li>
            <li>랭킹은 매일 자정에 업데이트됩니다</li>
          </ul>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RaidJoinModal;

