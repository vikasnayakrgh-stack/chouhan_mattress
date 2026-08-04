import { NextResponse } from 'next/server'
import { validateAdminSession } from '@/lib/auth/adminAuth'
import { logSecurityEvent } from '@/lib/security-logger'
import { getClientIp, checkRateLimit } from '@/lib/rate-limit'
import { productService } from '@/services/productService'
import { productCreateSchema, productUpdateSchema } from '@/lib/validations/admin/productSchema'

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 100

export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request)
    if (!checkRateLimit(clientIp, 'admin_api_products_get', RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS).success) {
      logSecurityEvent({ eventType: 'RATE_LIMIT_EXCEEDED', ipAddress: clientIp, resource: '/api/admin/products', action: 'GET', status: 'BLOCKED' })
      return NextResponse.json({ success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' }, data: null }, { status: 429 })
    }

    const auth = await validateAdminSession()
    if (!auth.authorized) {
      logSecurityEvent({ eventType: 'UNAUTHORIZED_ACCESS_ATTEMPT', ipAddress: clientIp, resource: '/api/admin/products', action: 'GET', status: 'FAILURE', details: { error: auth.error } })
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: auth.error || 'Unauthorized' }, data: null }, { status: auth.status })
    }

    const products = await productService.getAll()
    logSecurityEvent({ eventType: 'ADMIN_LOGIN_SUCCESS', ipAddress: clientIp, resource: '/api/admin/products', action: 'GET', status: 'SUCCESS', details: { count: products.length } })
    return NextResponse.json({ success: true, data: products, error: null }, { status: 200 })
  } catch (error: unknown) {
    const clientIp = getClientIp(request)
    const message = error instanceof Error ? error.message : 'Failed to fetch products'
    logSecurityEvent({ eventType: 'ORDER_FAILED', ipAddress: clientIp, resource: '/api/admin/products', action: 'GET', status: 'FAILURE', details: { error: message } })
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message }, data: null }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)
    if (!checkRateLimit(clientIp, 'admin_api_products_post', RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS).success) {
      logSecurityEvent({ eventType: 'RATE_LIMIT_EXCEEDED', ipAddress: clientIp, resource: '/api/admin/products', action: 'POST', status: 'BLOCKED' })
      return NextResponse.json({ success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' }, data: null }, { status: 429 })
    }

    const auth = await validateAdminSession()
    if (!auth.authorized) {
      logSecurityEvent({ eventType: 'UNAUTHORIZED_ACCESS_ATTEMPT', ipAddress: clientIp, resource: '/api/admin/products', action: 'POST', status: 'FAILURE', details: { error: auth.error } })
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: auth.error || 'Unauthorized' }, data: null }, { status: auth.status })
    }

    const rawBody = await request.json()
    const validation = productCreateSchema.safeParse(rawBody)
    if (!validation.success) {
      logSecurityEvent({ eventType: 'UNAUTHORIZED_ACCESS_ATTEMPT', ipAddress: clientIp, resource: '/api/admin/products', action: 'POST', status: 'FAILURE', details: { errors: validation.error.errors } })
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid product data', details: validation.error.errors }, data: null }, { status: 400 })
    }

    const product = await productService.create(validation.data as Parameters<typeof productService.create>[0])
    logSecurityEvent({ eventType: 'ORDER_CREATED', ipAddress: clientIp, resource: '/api/admin/products', action: 'POST', status: 'SUCCESS', details: { productId: product.id } })
    return NextResponse.json({ success: true, data: product, error: null }, { status: 201 })
  } catch (error: unknown) {
    const clientIp = getClientIp(request)
    const message = error instanceof Error ? error.message : 'Failed to create product'
    logSecurityEvent({ eventType: 'ORDER_FAILED', ipAddress: clientIp, resource: '/api/admin/products', action: 'POST', status: 'FAILURE', details: { error: message } })
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message }, data: null }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const clientIp = getClientIp(request)
    if (!checkRateLimit(clientIp, 'admin_api_products_patch', RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS).success) {
      logSecurityEvent({ eventType: 'RATE_LIMIT_EXCEEDED', ipAddress: clientIp, resource: '/api/admin/products', action: 'PATCH', status: 'BLOCKED' })
      return NextResponse.json({ success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' }, data: null }, { status: 429 })
    }

    const auth = await validateAdminSession()
    if (!auth.authorized) {
      logSecurityEvent({ eventType: 'UNAUTHORIZED_ACCESS_ATTEMPT', ipAddress: clientIp, resource: '/api/admin/products', action: 'PATCH', status: 'FAILURE', details: { error: auth.error } })
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: auth.error || 'Unauthorized' }, data: null }, { status: auth.status })
    }

    const rawBody = await request.json()
    const { id, ...updates } = rawBody as { id?: string; [key: string]: unknown }
    if (!id) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Product ID is required' }, data: null }, { status: 400 })
    }

    const validation = productUpdateSchema.safeParse(updates)
    if (!validation.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid update data', details: validation.error.errors }, data: null }, { status: 400 })
    }

    const product = await productService.update(id, validation.data as Parameters<typeof productService.update>[1])
    if (!product) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' }, data: null }, { status: 404 })
    }

    logSecurityEvent({ eventType: 'ORDER_CREATED', ipAddress: clientIp, resource: '/api/admin/products', action: 'PATCH', status: 'SUCCESS', details: { productId: id } })
    return NextResponse.json({ success: true, data: product, error: null }, { status: 200 })
  } catch (error: unknown) {
    const clientIp = getClientIp(request)
    const message = error instanceof Error ? error.message : 'Failed to update product'
    logSecurityEvent({ eventType: 'ORDER_FAILED', ipAddress: clientIp, resource: '/api/admin/products', action: 'PATCH', status: 'FAILURE', details: { error: message } })
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message }, data: null }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const clientIp = getClientIp(request)
    if (!checkRateLimit(clientIp, 'admin_api_products_delete', RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS).success) {
      logSecurityEvent({ eventType: 'RATE_LIMIT_EXCEEDED', ipAddress: clientIp, resource: '/api/admin/products', action: 'DELETE', status: 'BLOCKED' })
      return NextResponse.json({ success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' }, data: null }, { status: 429 })
    }

    const auth = await validateAdminSession()
    if (!auth.authorized) {
      logSecurityEvent({ eventType: 'UNAUTHORIZED_ACCESS_ATTEMPT', ipAddress: clientIp, resource: '/api/admin/products', action: 'DELETE', status: 'FAILURE', details: { error: auth.error } })
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: auth.error || 'Unauthorized' }, data: null }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Product ID is required' }, data: null }, { status: 400 })
    }

    const archived = await productService.archive(id)
    logSecurityEvent({ eventType: 'ORDER_CREATED', ipAddress: clientIp, resource: '/api/admin/products', action: 'DELETE', status: 'SUCCESS', details: { productId: id, archived } })
    return NextResponse.json({ success: true, data: { archived }, error: null }, { status: 200 })
  } catch (error: unknown) {
    const clientIp = getClientIp(request)
    const message = error instanceof Error ? error.message : 'Failed to delete product'
    logSecurityEvent({ eventType: 'ORDER_FAILED', ipAddress: clientIp, resource: '/api/admin/products', action: 'DELETE', status: 'FAILURE', details: { error: message } })
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message }, data: null }, { status: 500 })
  }
}
