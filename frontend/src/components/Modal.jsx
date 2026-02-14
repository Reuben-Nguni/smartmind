import React from 'react';

export default function Modal({ title, children, onClose, onConfirm, confirmLabel = 'Confirm', show }) {
  if (!show) return null;

  return (
    <div className="modal-backdrop" style={backdropStyle}>
      <div className="modal-dialog" role="document" style={dialogStyle}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const backdropStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050
};

const dialogStyle = { maxWidth: '560px', width: '100%' };
