"use client"

import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration } from 'chart.js/auto'

interface BusinessPredictionChartProps {
  predictions: {
    growthRates: number[]
    expenses: number[]
    satisfaction: number[]
  }
}

export default function BusinessPredictionChart({ predictions }: BusinessPredictionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Get next 6 months
    const months = Array.from({length: 6}, (_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() + i + 1)
      return d.toLocaleDateString('en-US', { month: 'short' })
    })

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Predicted Expenses',
            data: predictions.expenses,
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y',
          },
          {
            label: 'Predicted Growth',
            data: predictions.growthRates,
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y1',
          },
          {
            label: 'Predicted Satisfaction',
            data: predictions.satisfaction,
            borderColor: '#4BC0C0',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y2',
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Predicted Expenses ($)',
              color: '#FF6384'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Predicted Growth (%)',
              color: '#36A2EB'
            },
            grid: {
              drawOnChartArea: false,
            },
          },
          y2: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Predicted Satisfaction',
              color: '#4BC0C0'
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        }
      }
    }

    chartInstance.current = new Chart(chartRef.current, config)

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [predictions])

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
