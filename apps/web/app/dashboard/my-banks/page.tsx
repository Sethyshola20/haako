import BankCard from '../components/BankCard'
import HeaderBox from "../components/HeaderBox"
import { getAccounts } from '../../../actions/bank.action';
import { getLoggedInUserAction } from '../../../actions/user.action';
import { redirect } from 'next/navigation';


export default async function MyBanks () {
  const loggedIn = await getLoggedInUserAction();
  if(!loggedIn) redirect('/login')
  const accountsResponse = await getAccounts({ 
    userId: loggedIn.$id 
  })
  if(!accountsResponse.success) return;
  const accounts = accountsResponse.data

  return (
    <section className='flex'>
      <div className="my-banks">
        <HeaderBox 
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activites."
        />

        <div className="space-y-4">
          <h2 className="header-2">
            Your cards
          </h2>
          <div className="flex flex-wrap gap-6">
            {accounts && accounts.data.map((a: Account) => (
              <BankCard 
                key={accounts.id}
                account={a}
                userName={loggedIn?.firstName}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

