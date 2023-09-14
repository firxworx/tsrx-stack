import { UsersList } from '../components/features/users/UsersList'
import { PageHeading } from '../layout/PageLayout'
import { CreateUserFormModalTrigger } from '../components/features/users/UserForms'

export function UsersPage(): JSX.Element {
  return (
    <div>
      <div className="flex items-center mb-8">
        <PageHeading title="Users" className="flex-1 mb-0" />
        <aside className="flex justify-between items-center">
          <CreateUserFormModalTrigger />
        </aside>
      </div>
      <section>
        <p>These users are stored in a postgres database with CRUD functionality provided via ts-rest contract.</p>
        <h2 className="text-2xl tracking-tight font-semibold py-6 sm:py-8">Manage Users</h2>
        <UsersList showCreateAction={false} showEditActions={true} showDeleteActions={true} />
      </section>
    </div>
  )
}
