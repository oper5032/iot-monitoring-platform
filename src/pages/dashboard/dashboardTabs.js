import CityGasDashboard from './CityGasDashboard';
import HighTankDashboard from './HighTankDashboard';
import SkVaporizerDashboard from './SkVaporizerDashboard';
import SmartMeteringDashboard from './SmartMeteringDashboard';

export const dashboardTabs = [
  {
    key: 'citygas',
    title: '도시가스 회사',
    component: CityGasDashboard,
  },
  {
    key: 'tank',
    title: '고압 탱크',
    component: HighTankDashboard,
  },
  {
    key: 'sk',
    title: 'SK가스 기화기',
    component: SkVaporizerDashboard,
  },
  {
    key: 'sm',
    title: '스마트 미터링',
    component: SmartMeteringDashboard,
  },
];