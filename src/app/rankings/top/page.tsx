import { redirect } from 'next/navigation';

export default function TopRankings() {
  redirect('/rankings?type=top');
} 