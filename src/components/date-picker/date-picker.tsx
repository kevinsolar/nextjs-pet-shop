"use client"

import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { isValid, format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { get } from "http"
import { Calendar } from "../ui/calendar"
import { NavigationButton } from "./navigation-button"

export const DatePicker = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const dateParam = searchParams.get("date")

  const getInitialDate = useCallback(() => {
    if (!dateParam) return

    const [year, month, day] = dateParam.split("-").map(Number)
    const parsedDate = new Date(year, month - 1, day) // No JS, janeiro comeca em 0, como vamos receber, por exemplo Dezmebro como 12, precisamos subtrair 1 para obter o mes corretamente, pois 12, seria invalido, o maximo seria 11.

    if (!isValid(parsedDate)) return new Date()

    return parsedDate
  }, [dateParam])

  const [date, setDate] = useState<Date | undefined>(getInitialDate)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const updateQueryParams = (selectedDate: Date | undefined) => {
    if (!selectedDate) return

    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("date", format(selectedDate, "yyyy-MM-dd"))

    router.push(`${pathname}?${newParams.toString()}`)
  }

  const handleNavidateDate = (days: number) => {
    const newDate = addDays(date || new Date(), days)
    updateQueryParams(newDate)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    updateQueryParams(selectedDate)
    setIsPopoverOpen(false)
  }

  useEffect(() => {
    const newDate = getInitialDate()

    if (date?.getTime() !== newDate?.getTime()) {
      setDate(newDate)
    }
  }, [date, getInitialDate])

  return (
    <div className="flex items-center gap-2">
      <NavigationButton
        tooltipText="Dia anterior"
        onClick={() => handleNavidateDate(-1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </NavigationButton>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-min[180px] justify-between text-left font-normal bg-transparent border-border-primary text-content-primary hover:bg-background-tertiary hover:border-border-secondary hover:text-content-primary focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-border-brand focus:border-border-brand focus-visible:border-border-brand"
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-content-brand" />
              {date ? (
                format(date, "dd/MM/yy")
              ) : (
                <span>Selecione uma data</span>
              )}
            </div>

            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            autoFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>

      <NavigationButton
        tooltipText="Dia seguinte"
        onClick={() => handleNavidateDate(1)}
      >
        <ChevronRight className="h-4 w-4" />
      </NavigationButton>
    </div>
  )
}
