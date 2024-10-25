"use client"

import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration } from 'chart.js/auto'

interface CustomerBusinessData {
  businessExpenses: number
  businessGrowthRate: number
  customerSatisfactionScore: number
  averageOrderValue: number
  createdAt: Date
}

interface BusinessMetricsChartProps {
  data: CustomerBusinessData[]
}

export default function BusinessMetricsChart({ data }: BusinessMetricsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Sort data by createdAt date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    // Get the labels from actual dates
    const labels = sortedData.map(d => 
      new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short' })
    )

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Business Expenses',
            data: sortedData.map(d => d.businessExpenses),
            borderColor: '#FF6384',
            tension: 0.4,
            yAxisID: 'y',
          },
          {
            label: 'Growth Rate',
            data: sortedData.map(d => d.businessGrowthRate),
            borderColor: '#36A2EB',
            tension: 0.4,
            yAxisID: 'y1',
          },
          {
            label: 'Satisfaction Score',
            data: sortedData.map(d => d.customerSatisfactionScore),
            borderColor: '#4BC0C0',
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
              text: 'Expenses ($)',
              color: '#FF6384'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Growth Rate (%)',
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
              text: 'Satisfaction (1-10)',
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
  }, [data])

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
