import axios from 'axios';

export async function getCurrentIp() {
  const { data: ip_address } = await axios.get('https://api.ipify.org');
  return ip_address as string;
}
