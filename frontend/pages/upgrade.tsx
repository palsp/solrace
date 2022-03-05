import AppLayout from '~/app/AppLayout'
import { upgradeKart } from '~/upgrade/services'

const UpgradePage = () => {
  const handleUpgrade = async () => {
    try {
      await upgradeKart(
        '5MX92yt2re3A5qyXvY9D2T1qWyo7B98FK4Gbna8AqJcdq5ZiqjZofBcio4GeYKqYdQCzJsavRQG6UMSrwWAcQxMS',
      )
    } catch (e) {}
  }

  return (
    <AppLayout>
      <button onClick={handleUpgrade}>upgrade</button>
    </AppLayout>
  )
}

export default UpgradePage
