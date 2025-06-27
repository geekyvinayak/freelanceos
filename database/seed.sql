-- Sample data for testing (run after schema.sql)
-- Note: Replace the user_id with actual user IDs from your auth.users table

-- Sample projects
INSERT INTO projects (user_id, name, description, status) VALUES
('00000000-0000-0000-0000-000000000000', 'E-commerce Website', 'Building a modern e-commerce platform with React and Node.js', 'active'),
('00000000-0000-0000-0000-000000000000', 'Mobile App Design', 'UI/UX design for a fitness tracking mobile application', 'active'),
('00000000-0000-0000-0000-000000000000', 'Brand Identity Project', 'Complete brand identity design for a startup company', 'completed');

-- Sample notes (you'll need to replace project_id with actual IDs)
-- INSERT INTO notes (project_id, content) VALUES
-- ('project-id-1', 'Initial client meeting completed. Requirements gathered for the e-commerce platform.'),
-- ('project-id-1', 'Wireframes approved by client. Moving to development phase.'),
-- ('project-id-2', 'User research completed. Creating user personas and journey maps.'),
-- ('project-id-3', 'Logo design finalized and approved by client.');

-- Sample bills (you'll need to replace project_id with actual IDs)
-- INSERT INTO bills (project_id, invoice_number, amount, description, status, due_date) VALUES
-- ('project-id-1', 'INV-2024-0001', 2500.00, 'E-commerce website development - Phase 1', 'paid', '2024-01-15'),
-- ('project-id-1', 'INV-2024-0002', 1500.00, 'E-commerce website development - Phase 2', 'pending', '2024-02-15'),
-- ('project-id-2', 'INV-2024-0003', 800.00, 'Mobile app UI/UX design', 'pending', '2024-01-30'),
-- ('project-id-3', 'INV-2024-0004', 1200.00, 'Brand identity design package', 'paid', '2024-01-10');
