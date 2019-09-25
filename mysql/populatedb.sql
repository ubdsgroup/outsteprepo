use outstepdb
 -- populate peoples
DELETE FROM `peoples_framework_tags`;
INSERT INTO `peoples_framework_tags`
(`letter`,`tag`) 
VALUES 
('P','Population'),
('E','Environmental'),
('O','Organizational'),
('P','Physical'),
('L','Lifestyle'),
('E','Economic'),
('S','Social/Cultural');

-- populate sustainability goals
DELETE FROM `sustainability_goals`;
INSERT INTO `sustainability_goals`
(`name`,`description`,`image_location`)
VALUES
('Goal 1','No Poverty','{outstep_web_repo}/sg_goals_logos/sustainability_goal1.png'),
('Goal 2','Zero Hunger','{outstep_web_repo}/sg_goals_logos/sustainability_goal2.png'),
('Goal 3','Good Health and Well-being','{outstep_web_repo}/sg_goals_logos/sustainability_goal3.png'),
('Goal 4','Quality Education','{outstep_web_repo}/sg_goals_logos/sustainability_goal4.png'),
('Goal 5','Gender Equality','{outstep_web_repo}/sg_goals_logos/sustainability_goal5.png'),
('Goal 6','Clean Water and Sanitation','{outstep_web_repo}/sg_goals_logos/sustainability_goal6.png'),
('Goal 7','Affordable and Clean Energy','{outstep_web_repo}/sg_goals_logos/sustainability_goal7.png'),
('Goal 8','Decent Work and Economic Growth','{outstep_web_repo}/sg_goals_logos/sustainability_goal8.png'),
('Goal 9','Industry Innovation and Infrastructure','{outstep_web_repo}/sg_goals_logos/sustainability_goal9.png'),
('Goal 10','Reduced Inequality','{outstep_web_repo}/sg_goals_logos/sustainability_goal10.png'),
('Goal 11','Sustainable Cities and Communities','{outstep_web_repo}/sg_goals_logos/sustainability_goal11.png'),
('Goal 12','Responsible Consumption and Production','{outstep_web_repo}/sg_goals_logos/sustainability_goal12.png'),
('Goal 13','Climate Action','{outstep_web_repo}/sg_goals_logos/sustainability_goal13.png'),
('Goal 14','Life Below Water','{outstep_web_repo}/sg_goals_logos/sustainability_goal14.png'),
('Goal 15','Life on Land','{outstep_web_repo}/sg_goals_logos/sustainability_goal15.png'),
('Goal 16','Peace and Justice Strong Institutions','{outstep_web_repo}/sg_goals_logos/sustainability_goal16.png'),
('Goal 17','Partnerships to achieve the Goal','{outstep_web_repo}/sg_goals_logos/sustainability_goal17.png');
-- populate organizations
DELETE FROM `organizations`;
INSERT INTO `organizations`
(`name`,`latitude`,`longitude`,`url`,`logo_url`)
VALUES
('University at Buffalo', 42.991,-78.7865,'https://www.buffalo.edu','{outstep_web_repo}/organization_logos/ub_logo.png'),
('University of Toledo', 41.660,-83.6089,'https://www.utoledo.edu/','{outstep_web_repo}/organization_logos/utoledo_logo.png'),
('SUNY College of Environmental Science and Forestry', 43.0352,-76.1359,'https://www.esf.edu/','{outstep_web_repo}/organization_logos/sunyesf_logo.png'),
('University of Michigan', 42.278,-83.738,'https://umich.edu/','{outstep_web_repo}/organization_logos/umich_logo.png'),
('SUNY Oswego', 43.4512,-76.5424,'https://www.oswego.edu/','{outstep_web_repo}/organization_logos/sunyoswego_logo.png'),
('Clarkson University', 44.6636,-74.9987,'https://www.clarkson.edu/','{outstep_web_repo}/organization_logos/clarkson_logo.png'),
('Cleveland State University', 41.5023466,-81.6759,'https://www.csuohio.edu/','{outstep_web_repo}/organization_logos/clevelandstate_logo.png'),
('Penn State at Behrend', 42.1198064,-79.9844,'https://behrend.psu.edu/','{outstep_web_repo}/organization_logos/pennstatebehrend_logo.png');
-- populate roles
DELETE FROM `roles`;
INSERT INTO `roles`
(`name`,`roletype`,`image_location`)
VALUES
('Researcher','regular','{outstep_web_repo}/badge_logos/researcher.png'),
('Community Group','regular','{outstep_web_repo}/badge_logos/community_group.png'),
('Government','regular','{outstep_web_repo}/badge_logos/government.png'),
('Judge','expert','{outstep_web_repo}/badge_logos/judge.png'),
('Resiliency Officer','regular','{outstep_web_repo}/badge_logos/resilience_officer.png'),
('Observer','expert','{outstep_web_repo}/badge_logos/observer.png'),
('Private Sector','regular','{outstep_web_repo}/badge_logos/private_sector.png'),
('Student','regular','{outstep_web_repo}/badge_logos/student.png'),
('Sustainability Officer','regular','{outstep_web_repo}/badge_logos/sustainability_officer.png');
