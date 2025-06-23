import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "../../lib/utils"
import { Check, X } from "lucide-react" // Importando os ícones

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // --- Estilos para a base (o trilho) ---
      "peer inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      // Cor quando desligado (cinza)
      "data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-800",
      // Cor quando ligado (verde)
      "data-[state=checked]:bg-green-500",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        // --- Estilos para o círculo (o botão que desliza) ---
        "pointer-events-none block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition-transform flex items-center justify-center",
        // Posição quando ligado
        "data-[state=checked]:translate-x-7",
        // Posição quando desligado
        "data-[state=unchecked]:translate-x-0"
      )}
    >
      {/* Ícone que aparece quando está LIGADO (presente) */}
      <Check className="h-4 w-4 text-green-500 hidden data-[state=checked]:block" />
      
      {/* Ícone que aparece quando está DESLIGADO (ausente) */}
      <X className="h-4 w-4 text-gray-500 block data-[state=checked]:hidden" />
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
