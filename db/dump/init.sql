-- Government Services Portal Database Schema
-- Initialize the database for the multi-service Government Portal

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS appointment_status_history CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create role enum
CREATE TYPE user_role AS ENUM ('CITIZEN', 'OFFICER', 'ADMIN');
CREATE TYPE appointment_status AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'REQUIRES_INFO');
CREATE TYPE document_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE notification_type AS ENUM ('APPOINTMENT_CONFIRMATION', 'APPOINTMENT_REMINDER', 'STATUS_UPDATE', 'DOCUMENT_VERIFICATION', 'GENERAL');

-- Users table (with role support)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    nic VARCHAR(20) UNIQUE NOT NULL,
    mobile VARCHAR(15),
    date_of_birth DATE,
    address TEXT,
    role user_role DEFAULT 'CITIZEN',
    department_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    fee DECIMAL(10,2) NOT NULL,
    processing_days INTEGER NOT NULL,
    required_documents JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    appointment_number VARCHAR(50) UNIQUE NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(10) NOT NULL,
    office_location VARCHAR(100) NOT NULL,
    status appointment_status DEFAULT 'SCHEDULED',
    notes TEXT,
    officer_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    status document_status DEFAULT 'PENDING',
    verification_notes TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP
);

-- Feedback table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support tickets table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority ticket_priority DEFAULT 'MEDIUM',
    category VARCHAR(50),
    status ticket_status DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointment status history
CREATE TABLE appointment_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    previous_status appointment_status,
    new_status appointment_status NOT NULL,
    changed_by UUID,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for department_id in users table
ALTER TABLE users ADD CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nic ON users(nic);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_service_id ON appointments(service_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_documents_appointment_id ON documents(appointment_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_feedback_appointment_id ON feedback(appointment_id);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Insert sample departments
INSERT INTO departments (id, name, code, description) VALUES
(uuid_generate_v4(), 'Immigration and Emigration', 'IMM', 'Passport and visa services'),
(uuid_generate_v4(), 'Department of Motor Traffic', 'DMT', 'Driving licenses and vehicle registration'),
(uuid_generate_v4(), 'Registrar General', 'RG', 'Birth, death, and marriage certificates'),
(uuid_generate_v4(), 'National Registration Department', 'NRD', 'National identity cards and registration');

-- Insert sample services
INSERT INTO services (department_id, name, code, description, fee, processing_days, required_documents) VALUES
((SELECT id FROM departments WHERE code = 'IMM'), 'Ordinary Passport', 'PASS_ORD', 'Standard passport processing', 7500.00, 21, '["Birth Certificate", "NIC", "Guarantor Form"]'),
((SELECT id FROM departments WHERE code = 'IMM'), 'Express Passport', 'PASS_EXP', 'Fast-track passport processing', 12500.00, 7, '["Birth Certificate", "NIC", "Guarantor Form"]'),
((SELECT id FROM departments WHERE code = 'IMM'), 'Urgent Passport', 'PASS_URG', 'Urgent passport processing', 17500.00, 3, '["Birth Certificate", "NIC", "Guarantor Form"]'),
((SELECT id FROM departments WHERE code = 'DMT'), 'Driving License', 'DL_NEW', 'New driving license application', 2500.00, 14, '["Medical Certificate", "NIC", "School Certificate"]'),
((SELECT id FROM departments WHERE code = 'RG'), 'Birth Certificate', 'CERT_BIRTH', 'Birth certificate issuance', 100.00, 7, '["Attestation Letter", "Parents NIC"]'),
((SELECT id FROM departments WHERE code = 'NRD'), 'National ID Card', 'NIC_NEW', 'New NIC application', 500.00, 10, '["Birth Certificate", "Address Proof"]');

-- Insert sample users
INSERT INTO users (email, password_hash, full_name, nic, mobile, date_of_birth, address, role, department_id) VALUES
-- Citizens
('anura@example.com', '$2a$10$hash_here', 'Anura Perera', '900123456V', '+94771234567', '1990-12-05', 'No.7, Galle Road, Colombo', 'CITIZEN', NULL),
('sita@example.com', '$2a$10$hash_here', 'Sita Fernando', '891234567V', '+94772345678', '1989-05-15', 'No.25, Kandy Road, Kandy', 'CITIZEN', NULL),
-- Officers
('officer.imm@gov.lk', '$2a$10$hash_here', 'Nimal Silva', '801234567V', '+94773456789', '1980-03-20', 'Immigration Office, Colombo', 'OFFICER', (SELECT id FROM departments WHERE code = 'IMM')),
('officer.dmt@gov.lk', '$2a$10$hash_here', 'Kamala Jayasinghe', '851234567V', '+94774567890', '1985-08-10', 'DMT Office, Narahenpita', 'OFFICER', (SELECT id FROM departments WHERE code = 'DMT')),
-- Admin
('admin@gov.lk', '$2a$10$hash_here', 'Admin User', '751234567V', '+94775678901', '1975-01-01', 'Government Secretariat', 'ADMIN', NULL);

-- Insert sample appointments
INSERT INTO appointments (user_id, service_id, appointment_number, appointment_date, appointment_time, office_location, status, officer_id) VALUES
((SELECT id FROM users WHERE email = 'anura@example.com'), (SELECT id FROM services WHERE code = 'PASS_ORD'), 'APP2025001', '2025-08-20', '09:30', 'Immigration Office - Colombo', 'CONFIRMED', (SELECT id FROM users WHERE email = 'officer.imm@gov.lk')),
((SELECT id FROM users WHERE email = 'sita@example.com'), (SELECT id FROM services WHERE code = 'DL_NEW'), 'APP2025002', '2025-08-21', '14:00', 'DMT Office - Narahenpita', 'SCHEDULED', (SELECT id FROM users WHERE email = 'officer.dmt@gov.lk'));

-- Insert sample documents
INSERT INTO documents (appointment_id, user_id, document_type, original_name, status) VALUES
((SELECT id FROM appointments WHERE appointment_number = 'APP2025001'), (SELECT id FROM users WHERE email = 'anura@example.com'), 'Birth Certificate', 'birth_cert_anura.pdf', 'VERIFIED'),
((SELECT id FROM appointments WHERE appointment_number = 'APP2025001'), (SELECT id FROM users WHERE email = 'anura@example.com'), 'NIC', 'nic_anura.pdf', 'VERIFIED'),
((SELECT id FROM appointments WHERE appointment_number = 'APP2025002'), (SELECT id FROM users WHERE email = 'sita@example.com'), 'Medical Certificate', 'medical_sita.pdf', 'PENDING');

-- Insert sample feedback
INSERT INTO feedback (appointment_id, user_id, rating, comment) VALUES
((SELECT id FROM appointments WHERE appointment_number = 'APP2025001'), (SELECT id FROM users WHERE email = 'anura@example.com'), 5, 'Excellent service! Very quick and professional.');

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
