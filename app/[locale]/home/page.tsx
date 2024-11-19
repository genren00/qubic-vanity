"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Wallet, Pause, Play, Copy, Eye, EyeOff } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { QRCodeSVG } from 'qrcode.react'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Home() {
  const t = useTranslations('Home')
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [pattern, setPattern] = useState('')
  const [patternType, setPatternType] = useState<'prefix' | 'suffix'>('prefix')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ privateKey: string; publicId: string } | null>(null)
  const [generatedCount, setGeneratedCount] = useState(0)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [lastCount, setLastCount] = useState(0)
  const [generationSpeed, setGenerationSpeed] = useState(0)
  const [cpuUsage, setCpuUsage] = useState(55)
  const [workerSpeeds, setWorkerSpeeds] = useState<{ [key: number]: number }>({})
  const [workerCounts, setWorkerCounts] = useState<{ [key: number]: number }>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const { toast } = useToast()

  const [maxWorkers, setMaxWorkers] = useState(4)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMaxWorkers(window.navigator?.hardwareConcurrency || 4)
    }
  }, [])

  const incrementCPU = () => {
    if (cpuUsage < 100) {
      setCpuUsage(prev => Math.min(prev + 10, 100))
    }
  }

  const decrementCPU = () => {
    if (cpuUsage > 10) {
      setCpuUsage(prev => Math.max(prev - 10, 10))
    }
  }

  // 获取CPU核心数
  const getCPUCount = async () => {
    if (typeof window !== 'undefined' && window.navigator.hardwareConcurrency) {
      return window.navigator.hardwareConcurrency
    }
    return 4 // 默认值
  }

  const copyToClipboard = async (text: string) => {
    try {
      if (typeof window !== 'undefined') {
        await window.navigator.clipboard.writeText(text)
        toast({
          title: t('toast.copied'),
          duration: 2000,
        })
      }
    } catch {
      toast({
        title: t('toast.error'),
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  const handlePause = () => {
    setIsPaused(true)
    // 保存当前的总生成数量
    const totalCount = Object.values(workerCounts).reduce((sum, count) => sum + count, 0)
    setLastCount(totalCount)
    // 停止所有 workers
    workers.forEach(worker => worker.terminate())
    setWorkers([])
    setWorkerCounts({})
    setWorkerSpeeds({})
    // 显式设置生成速度为 0
    setGenerationSpeed(0)
  }

  const handleResume = () => {
    setIsPaused(false)
    startWorkers(lastCount)
  }

  const startWorkers = (startCount = 0) => {
    // 清除旧的 workers
    workers.forEach(worker => worker.terminate())
    setWorkers([])
    setWorkerCounts({})
    setWorkerSpeeds({})
    
    // 重置状态
    setProgress(0)
    resetGeneration(startCount)
    setResult(null)

    try {
      const newWorkers: Worker[] = []
      
      // 使用 CPU workers
      const targetWorkers = Math.max(1, Math.floor((maxWorkers * cpuUsage) / 100))
      const countPerWorker = Math.floor(startCount / targetWorkers)
      
      for (let i = 0; i < targetWorkers; i++) {
        const worker = new Worker('/worker.js')
        worker.onmessage = (e) => {
          const { type, privateKey, publicId, error, count, speed, workerId } = e.data
          console.log('Worker message:', { type, count, speed, workerId })

          if (type === 'progress') {
            // 更新单个 worker 的计数和速度
            setWorkerCounts(prev => ({
              ...prev,
              [workerId]: count
            }))
            setWorkerSpeeds(prev => ({
              ...prev,
              [workerId]: speed
            }))
          } else if (type === 'count') {
            // 只更新计数
            setWorkerCounts(prev => ({
              ...prev,
              [workerId]: count
            }))
          } else if (type === 'success') {
            setResult({
              privateKey,
              publicId,
            })
            setProgress(100)
            setIsGenerating(false)
            setIsPaused(false)
            setGenerationSpeed(0)
            setShowSuccessDialog(true)  // 显示成功对话框
            
            // 终止所有workers
            newWorkers.forEach(w => w.terminate())
            setWorkers([])
          } else if (type === 'error') {
            console.error('Error generating address:', error)
            setIsGenerating(false)
            setIsPaused(false)
            setGenerationSpeed(0)
            
            // 终止所有workers
            newWorkers.forEach(w => w.terminate())
            setWorkers([])
            
            toast({
              title: t('toast.error'),
              description: t('toast.errorGenerating', { error }),
              variant: "destructive"
            })
          }
        }

        // 发送生成请求到Worker
        worker.postMessage({
          type: 'start',
          pattern,
          isPrefix: patternType === 'prefix',
          startCount: countPerWorker,
          workerId: i
        })

        newWorkers.push(worker)
      }

      setWorkers(newWorkers)
    } catch (error) {
      console.error('Error starting workers:', error)
      setIsGenerating(false)
      setIsPaused(false)
      setGenerationSpeed(0)
      toast({
        title: t('toast.error'),
        description: t('toast.errorStarting'),
        variant: "destructive"
      })
    }
  }

  const togglePause = () => {
    console.log('Current state:', {
      isGenerating,
      isPaused,
      workers: workers.length,
      generatedCount
    })

    if (!isPaused) {
      handlePause()
    } else {
      handleResume()
    }
  }

  // 计算难度
  const getDifficulty = (length: number) => {
    if (length === 0) return 1
    return Math.pow(26, length)
  }

  // 计算总生成数量和进度
  useEffect(() => {
    if (isGenerating && !isPaused) {
      const totalCount = Object.values(workerCounts).reduce((sum, count) => sum + count, 0)
      setGeneratedCount(totalCount)
      
      // 使用总数计算进度
      const difficulty = getDifficulty(pattern.length)
      const progressPercent = Math.min(Math.floor((totalCount / difficulty) * 100), 100)
      setProgress(progressPercent)
    }
  }, [workerCounts, isGenerating, isPaused, pattern])

  // 计算总速度
  useEffect(() => {
    if (isGenerating && !isPaused) {
      const totalSpeed = Object.values(workerSpeeds).reduce((sum, speed) => sum + speed, 0)
      setGenerationSpeed(totalSpeed)
    } else {
      setGenerationSpeed(0)  // 当不在生成或已暂停时，速度为 0
    }
  }, [workerSpeeds, isGenerating, isPaused])

  const SuccessDialog = () => (
    <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('successDialog.title')}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground text-center sm:text-left">
          <AlertDialogDescription>
            {t('successDialog.description')}
          </AlertDialogDescription>
          <AlertDialogDescription>
            {t('successDialog.sponsor')}
          </AlertDialogDescription>
          <code className="block p-3 bg-muted rounded-md text-sm break-all">
            {t('successDialog.sponsorAddress')}
          </code>
          <AlertDialogDescription>
            {t('successDialog.sponsorDescription')}
          </AlertDialogDescription>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('successDialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            navigator.clipboard.writeText(t('successDialog.sponsorAddress'))
            toast({
              description: t('toast.copied'),
            })
          }}>
            {t('successDialog.copyAddress')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  const resetGeneration = (startCount: number = 0) => {
    setGeneratedCount(startCount)
    setGenerationSpeed(0)
    setResult(null)
    setLastCount(0)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {t('building')}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('dataFetching')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-12">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5" />
                  <CardTitle>{t('title')}</CardTitle>
                </div>
                <CardDescription>
                  {t('description')}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{t('inputLabel')}</Label>
                  <Input 
                    type="text" 
                    value={pattern} 
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase()
                      setPattern(value)
                    }} 
                    placeholder={t('inputPlaceholder')} 
                  />
                  <div className="text-sm text-muted-foreground">
                    <span className="text-xs">{t('sampleAddress')}</span>
                    <span className="font-mono">
                      {patternType === 'prefix' 
                        ? ' QUBICABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABC'
                        : ' ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCQUBIC'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="h-6 flex items-center">
                      <Label>{t('prefixSuffix.label')}</Label>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant={patternType === 'prefix' ? 'default' : 'outline'}
                        onClick={() => setPatternType('prefix')}
                        className="flex-1"
                      >
                        {t('prefixSuffix.prefix')}
                      </Button>
                      <Button
                        variant={patternType === 'suffix' ? 'default' : 'outline'}
                        onClick={() => setPatternType('suffix')}
                        className="flex-1"
                      >
                        {t('prefixSuffix.suffix')}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col gap-2">
                      <div className="h-6 flex items-center justify-between">
                        <Label>{t('performance')}</Label>
                        <span className="text-sm text-muted-foreground">{cpuUsage}%</span>
                      </div>
                      <div className="mt-2 flex gap-2 h-5">
                        <Slider
                          value={[cpuUsage]}
                          onValueChange={(value) => setCpuUsage(value[0])}
                          min={10}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className={cn(
                      "flex-1",
                      isGenerating && !isPaused 
                        ? "bg-green-500/80 hover:bg-green-500"
                        : "bg-green-500 hover:bg-green-600"
                    )}
                    size="lg" 
                    onClick={() => {
                      setIsPaused(false)
                      resetGeneration(0)
                      setIsGenerating(true)
                      startWorkers(0)
                    }}
                    disabled={isGenerating && !isPaused}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {isGenerating && !isPaused ? t('buttons.generating') : t('buttons.generate')}
                  </Button>
                  <Button 
                    className={cn(
                      "flex-1",
                      isGenerating
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-muted text-muted-foreground hover:bg-muted"
                    )}
                    size="lg" 
                    onClick={togglePause}
                    disabled={!isGenerating}
                  >
                    {isPaused ? (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        {t('buttons.continue')}
                      </>
                    ) : (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        {t('buttons.pause')}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('generationInfo.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('generationInfo.difficulty.label')}</span>
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        {t('generationInfo.difficulty.estimate')} {pattern ? getDifficulty(pattern.length).toLocaleString() : 1} {t('generationInfo.difficulty.times')}
                      </div>
                      {pattern && (
                        <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                          {pattern.length <= 2 && t('generationInfo.difficulty.easy')}
                          {pattern.length === 3 && t('generationInfo.difficulty.medium')}
                          {pattern.length === 4 && t('generationInfo.difficulty.hard')}
                          {pattern.length >= 5 && t('generationInfo.difficulty.extreme')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('generationInfo.generated')}</span>
                    <span>{generatedCount.toLocaleString()} addresses</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('generationInfo.probability')}</span>
                    <span>{pattern ? Math.ceil(getDifficulty(pattern.length) * 0.693).toLocaleString() : 0} addresses</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('generationInfo.speed')}</span>
                    <span>{generationSpeed.toLocaleString()} addr/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('generationInfo.status.label')}</span>
                    <span>
                      {!isGenerating && !isPaused && !result ? t('generationInfo.status.waiting') :
                       isGenerating && !isPaused ? t('generationInfo.status.generating') :
                       isPaused ? t('generationInfo.status.paused') :
                       result ? t('generationInfo.status.success') : t('generationInfo.status.waiting')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={progress} className="h-6">
                    <div className="absolute inset-0 flex items-center justify-center text-[13px]">
                      {progress}%
                    </div>
                  </Progress>
                </div>

                <Alert className="text-sm flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="mb-0">{t('generationInfo.warning')}</AlertTitle>
                  </div>
                </Alert>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('result.title')}</CardTitle>
                  <CardDescription>
                    {t('result.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                    <div className="flex flex-col items-center gap-4">
                      <div className="overflow-hidden rounded-xl border bg-white p-2">
                        <QRCodeSVG
                          value={result.privateKey || ''}
                          size={168}
                          level="H"
                          includeMargin={true}
                        />
                        <div className="mt-2 text-center text-xs text-muted-foreground">
                          {t('result.scanQR')}
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label>{t('result.address')}</Label>
                        <div className="relative">
                          <Input
                            type="text"
                            value={result.publicId || ''}
                            readOnly
                            className="font-mono pr-10"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => {
                              if (result.publicId) {
                                navigator.clipboard.writeText(result.publicId)
                                toast({
                                  description: t('toast.copied'),
                                })
                              }
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t('result.privateKey')}</Label>
                        <form onSubmit={(e) => e.preventDefault()} className="relative">
                          <input 
                            type="text" 
                            autoComplete="username" 
                            style={{ display: 'none' }} 
                            aria-hidden="true"
                          />
                          <Input
                            type={showPrivateKey ? "text" : "password"}
                            value={result.privateKey || ''}
                            readOnly
                            className="font-mono pr-20"
                            autoComplete="new-password"
                            aria-label="Private key"
                          />
                          <div className="absolute right-0 top-0 h-full flex">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPrivateKey(!showPrivateKey)}
                              type="button"
                            >
                              {showPrivateKey ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-full px-3 hover:bg-transparent"
                              onClick={() => {
                                if (result.privateKey) {
                                  navigator.clipboard.writeText(result.privateKey)
                                  toast({
                                    description: t('toast.copied'),
                                  })
                                }
                              }}
                              type="button"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <SuccessDialog />
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
