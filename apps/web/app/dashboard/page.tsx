
import HeaderBox from './components/HeaderBox'
import RecentTransactions from './components/RecentTransactions';
import TotalBalanceBox from './components/TotalBalanceBox';
import { getAccount, getAccounts } from '../../actions/bank.action';
import { getLoggedInUserAction } from '../../actions/user.action';
import { redirect } from 'next/navigation';

export default async function Home({ searchParams: { id, page } }: SearchParamProps) {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUserAction();
  if(!loggedIn) redirect('/login');
  
  const accountsResponse = await getAccounts({ 
    userId: loggedIn.$id 
  })
  if(!accountsResponse.success) return;
  const accounts = accountsResponse.data
  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId })

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox 
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>

        <RecentTransactions 
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>
    </section>
  )
}