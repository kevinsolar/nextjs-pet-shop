"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/button"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  CalendarIcon,
  ChevronDown,
  Clock,
  Dog,
  Loader2,
  Phone,
  User,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { IMaskInput } from "react-imask"
import { Textarea } from "../ui/textarea"
import { format, setHours, setMinutes, startOfToday } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "../ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { toast } from "sonner"
import { createAppointment } from "@/app/actions"

const appointmentFormSchema = z
  .object({
    tutorName: z.string().min(3, "O nome do tutor é obrigatório"),
    petName: z.string().min(3, "O nome do pet é obrigatório"),
    phone: z.string().min(11, "O telefone é obrigatório"),
    description: z.string().min(3, "A descrição é obrigatória"),
    scheduleAt: z
      .date({ error: "A Data é obrigatória" })
      .min(startOfToday(), { message: "A Data não pode ser no passado" }),
    time: z.string().min(1, "A hora é obrigatória"),
  })
  .refine(
    (data) => {
      const [hour, min] = data.time.split(":")
      const scheduleDateTime = setMinutes(
        setHours(data.scheduleAt, Number(hour)),
        Number(min)
      )
      return scheduleDateTime > new Date()
    },
    {
      path: ["time"],
      error: "O horario não pode ser no passado",
    }
  )

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>

export const AppointmentForm = () => {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      tutorName: "",
      petName: "",
      phone: "",
      description: "",
      scheduleAt: undefined,
      time: "",
    },
  })

  const onSubmit = async (data: AppointmentFormValues) => {
    const [hour, min] = data.time.split(":")

    const scheduleAt = new Date(data.scheduleAt)
    scheduleAt.setHours(Number(hour), Number(min), 0, 0)

    // invoca nossa SERVER ACTION
    await createAppointment({
      ...data,
      scheduleAt,
    })

    toast.success(`Agendamento criado com sucesso!`)

    console.log(data)
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="brand">Novo Agendamento</Button>
        </DialogTrigger>

        <DialogContent
          variant="appointment"
          overlayVariant="blurred"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle size="modal">Agende um atendimento</DialogTitle>
            <DialogDescription size="modal">
              Aqui você pode ver todos os clientes e serviços agendados para
              hoje.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tutorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Nome do tutor
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand"
                          size={20}
                        />
                        <Input
                          placeholder="Nome do tutor"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="petName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Nome do pet
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Dog
                          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand"
                          size={20}
                        />
                        <Input
                          placeholder="Thor"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Telefone
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone
                          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand"
                          size={20}
                        />
                        <IMaskInput
                          placeholder="(00) 90000-0000"
                          mask="(00) 00000-0000"
                          className="pl-10 flex h-12 w-full rounded-md border border-border-primary bg-background-tertiary px-3 py-2 text-sm text-content-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-border-brand disabled:cursor-not-allowed disabled:opacity-50 hover:border-border-secondaryfocus:border-border-brand focus-visible:border-border-brand aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Descrição do serviço
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição do serviço"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                <FormField
                  control={form.control}
                  name="scheduleAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-label-medium-size text-content-primary">
                        Data
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-between text-left font-normal bg-background-tertiary border-border-primary text-content-primary hover:bg-background-tertiary hover:border-border-secondary hover:text-content-primary focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-border-brand focus:border-border-brand focus-visible:border-border-brand",
                                !field.value && "text-content-secondary"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <CalendarIcon
                                  size={20}
                                  className="text-content-brand"
                                />
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                              </div>
                              <ChevronDown className="opacity-50 h-4 w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < startOfToday()}
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-label-medium-size text-content-primary">
                        Hora
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-content-brand" />
                              <SelectValue placeholder="--:00" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="brand"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Agendar"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

const generateTimeOptions = (): string[] => {
  const times = []

  for (let hour = 9; hour <= 21; hour++) {
    const timeString = `${hour.toString().padStart(2, "0")}:00`
    if (hour != 12 && hour != 17) {
      times.push(timeString)
    }
  }

  return times
}

const TIME_OPTIONS = generateTimeOptions()
