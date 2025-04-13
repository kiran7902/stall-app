import { redirect } from 'next/navigation';

export default function BottomRankings() {
  redirect('/rankings?type=bottom');
}