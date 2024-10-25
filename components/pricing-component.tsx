"use client"

import { useState } from "react"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function PricingComponent() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className="bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Here is a plan</h2>
          <p className="mt-2 text-lg text-gray-300">Simple pricing that grows with you </p>
          <p className="mt-2 text-lg text-gray-100">Stripe is not allowed in India. Integrate your own payment service.</p>
        </div>  
        <div className="mt-8 flex justify-center items-center space-x-4">
          <span className="text-white">Monthly</span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <span className="text-white">Annual</span>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className="bg-gray-900 border-gray-700 flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-center text-white">
                  <span className="text-5xl font-extrabold">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-xl font-medium text-gray-400">
                    /{isAnnual ? "year" : "month"}
                  </span>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-300">{feature}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full bg-white text-black hover:bg-gray-200 mt-4">
                  Get started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

const pricingPlans = [
  {
    name: "Basic",
    description: "Everything you need to get started",
    monthlyPrice: 9,
    annualPrice: 99,
    features: [
      "Up to 5 users",
      "Basic reporting",
      "1GB storage",
      "Email support",
    ],
  },
  {
    name: "Pro",
    description: "Best for growing teams",
    monthlyPrice: 29,
    annualPrice: 319,
    features: [
      "Up to 20 users",
      "Advanced reporting",
      "10GB storage",
      "Priority email support",
      "Phone support",
    ],
  },
  {
    name: "Enterprise",
    description: "For large-scale organizations",
    monthlyPrice: 99,
    annualPrice: 1089,
    features: [
      "Unlimited users",
      "Custom reporting",
      "Unlimited storage",
      "24/7 phone & email support",
      "Dedicated account manager",
    ],
  },
]
