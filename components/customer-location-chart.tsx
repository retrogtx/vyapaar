"use client"

import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration } from 'chart.js/auto'

interface Customer {
  state: string | null;
  purchaseHistory: string | null;
}

interface CustomerLocationChartProps {
  customers: Customer[];
}

function extractPurchaseCount(purchaseHistory: string | null): number {
  if (!purchaseHistory) return 0
  const match = purchaseHistory.match(/\d+/)
  if (match) {
    return Number(match[0])
  }
  return 0
}

export default function CustomerLocationChart({ customers }: CustomerLocationChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Clean up previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Process data for the chart
    const stateOrderCounts = customers.reduce((acc: { [key: string]: number }, customer) => {
      const state = customer.state || 'Unknown'
      const purchases = extractPurchaseCount(customer.purchaseHistory)
      acc[state] = (acc[state] || 0) + purchases
      return acc
    }, {})

    // Sort states by order count and take top 8
    const topStates = Object.entries(stateOrderCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .reduce((obj: { [key: string]: number }, [key, value]) => {
        obj[key] = value
        return obj
      }, {})

    const chartColors = [
      '#FF6384', // Pink
      '#36A2EB', // Blue
      '#FFCE56', // Yellow
      '#4BC0C0', // Teal
      '#9966FF', // Purple
      '#FF9F40', // Orange
      '#45B7D1', // Light Blue
      '#96C93D'  // Green
    ]

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: Object.keys(topStates),
        datasets: [{
          data: Object.values(topStates),
          backgroundColor: chartColors,
          borderColor: 'rgb(var(--background))',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#FFFFFF',  // Changed to hex color
              padding: 20,
              font: {
                size: 12,
              },
              generateLabels: (chart) => {
                const datasets = chart.data.datasets;
                const labels = chart.data.labels || [];
                return labels.map((label, i) => ({
                  text: `${label} - ${datasets[0].data[i]} orders`,
                  fillStyle: chartColors[i],
                  strokeStyle: chartColors[i],
                  lineWidth: 0,
                  hidden: false,
                  index: i,
                  // Added text color options
                  fontColor: '#FFFFFF',
                  color: '#FFFFFF'
                }))
              },
              boxWidth: 15,
              boxHeight: 15,
              usePointStyle: false
            }
          },
          title: {
            display: true,
            text: 'Orders by State',
            color: 'white',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 30
            }
          }
        }
      }
    }

    // Create new chart instance
    chartInstance.current = new Chart(chartRef.current, config)

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [customers])

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
