import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CreateIcon from '@mui/icons-material/Create';
import SendIcon from '@mui/icons-material/Send';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { AuthContext } from '../components/AuthContext'; 


export const menuItems = [
  { text: 'Create Survey', icon: <CreateIcon />, route: '/createSurvey', roles: ['admin'] },
  { text: 'Send Survey', icon: <SendIcon />, route: '/sendSurvey', roles: ['admin', 'surveyor'] },
  { text: 'View Responses', icon: <ListAltIcon />, route: '/viewResponses', roles: ['admin'] },
  { text: 'Analyze Results', icon: <AssessmentIcon />, route: '/analyzeResults', roles: ['admin'] },
  { text: 'View Surveys', icon: <AssessmentIcon />, route: '/viewSurveys', roles: ['admin'] },
  { text: 'Test', icon: <AssessmentIcon />, route: '/test', roles: ['respondent'] }
];


const MenuItemsComponent = () => {
  const { user } = useContext(AuthContext);

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div>
      {visibleMenuItems.map((item, index) => (
        <ListItem button key={item.text} component={Link} to={item.route}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </div>
  );
};

export default MenuItemsComponent;
