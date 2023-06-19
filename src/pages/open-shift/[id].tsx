import { Button, Card, ToastService } from "../../components"
import { api } from "../../utils/api"
import { serverSideHelper } from "../../utils/serverSideHelper"
import type { InferGetServerSidePropsType, GetServerSideProps, GetServerSidePropsContext, PreviewData } from 'next'
import { ParsedUrlQuery } from "querystring"
import { formatDate } from "../../utils/date/formatDate"
import { formatTime } from "../../utils/date/formatTime"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export const getServerSideProps: GetServerSideProps<{
  id: string
}> = async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
  const helper = await serverSideHelper({ req: context.req, res: context.res })

  if (!(context.params && context.params.id)) throw new Error('Missing id')
  const id = context.params.id
  if (typeof id !== 'string') throw new Error('Invalid id')
  await helper.openStaffing.getOpenStaffing.prefetch({ id })
  return {
    props: {
      trpcState: helper.dehydrate(),
      id,
    },
  }
}

export default function OpenShiftPage({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const context = api.useContext()
  const { data: openStaffing, error } = api.openStaffing.getOpenStaffing.useQuery({ id })
  const { mutate: fillOpenStaffing } = api.openStaffing.fillOpenStaffing.useMutation({
    onError: (error) => ToastService.error(error.message),
    onSuccess: () => {
      ToastService.success("Shift ingevuld")
      router.push("/").catch((e) => {
        ToastService.error(e.message)
      })
      context.staffing.getPersonalStaffing.invalidate().catch((e) => {
        ToastService.error(e.message)
      })
      context.staffing.getStaffing.invalidate().catch((e) => {
        ToastService.error(e.message)
      })
    }
  })
  const { data: session } = useSession()
  if (error) return <div>Error: {error.message}</div>
  if (!openStaffing) return <div>Not found</div>

  const skipOpenStaffing = () => {
    router.push("/").catch((e) => {
      ToastService.error(e.message)
    })
    ToastService.info("Shift niet ingevuld")
  }

  return (
    <div className="flex justify-center max-h-screen pb-24">
      <div className="flex flex-col w-full max-w-xl gap-8 pt-8">
        <h1 className="text-center">Goeie dag {session?.user?.first_name ?? ""}</h1>
        <Card>
          <div className="flex flex-col gap-4">
            <h1>Kan jij invallen?</h1>
            <h2>{openStaffing.absent_user?.name ?? "Iemand"} is afwezig op {formatDate(openStaffing.shift.start)}</h2>
            <p>Van: {formatDate(openStaffing.shift.start)} {formatTime(openStaffing.shift.start)}</p>
            <p>Tot: {formatDate(openStaffing.shift.end)} {formatTime(openStaffing.shift.end)}</p>
            <div className="flex gap-4">
              <Button onPress={() => { skipOpenStaffing() }} color="red">Ik kan niet</Button>
              <Button onPress={() => { fillOpenStaffing({ id }) }} color="teal">Neem shift</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}