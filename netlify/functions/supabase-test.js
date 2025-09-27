// Simple Supabase diagnostic test function

exports.handler = async (event, context) => {
    try {
        console.log('[SUPABASE TEST] Starting diagnostic...');
        
        // Check all possible Supabase environment variable names
        const allSupabaseEnvs = Object.keys(process.env).filter(key => 
            key.toLowerCase().includes('supabase')
        );
        
        const envCheck = {
            SUPABASE_URL: process.env.SUPABASE_URL ? 'present' : 'missing',
            SUPABASE_DATABASE_URL: process.env.SUPABASE_DATABASE_URL ? 'present' : 'missing',
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'present' : 'missing',
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'present' : 'missing',
            // Check Netlify extension alternatives
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'missing',
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing',
            SUPABASE_PROJECT_URL: process.env.SUPABASE_PROJECT_URL ? 'present' : 'missing',
            all_supabase_vars: allSupabaseEnvs
        };
        
        console.log('Environment variables:', envCheck);
        
        // Find the actual Supabase URL from various possible env var names
        const supabaseUrl = process.env.SUPABASE_URL || 
                           process.env.SUPABASE_DATABASE_URL || 
                           process.env.NEXT_PUBLIC_SUPABASE_URL || 
                           process.env.SUPABASE_PROJECT_URL ||
                           process.env.VITE_SUPABASE_URL;
        
        console.log('Found Supabase URL:', supabaseUrl ? 'yes' : 'no');
        
        if (!supabaseUrl) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'error',
                    message: 'No Supabase URL found in any expected environment variables',
                    env_check: envCheck,
                    available_env_vars: allSupabaseEnvs
                })
            };
        }

        // Try to initialize Supabase client
        const { createClient } = require('@supabase/supabase-js');
        let client = null;
        let writeCapable = false;

        // Check for service role key (various possible names)
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (serviceKey) {
            client = createClient(
                supabaseUrl,
                serviceKey,
                { auth: { autoRefreshToken: false, persistSession: false } }
            );
            writeCapable = true;
            console.log('Initialized with service role key');
        } else if (anonKey) {
            client = createClient(
                supabaseUrl,
                anonKey,
                { auth: { autoRefreshToken: false, persistSession: false } }
            );
            console.log('Initialized with anon key');
        }

        if (!client) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'error',
                    message: 'Could not initialize Supabase client',
                    env_check: envCheck
                })
            };
        }

        // Test database connection by querying tables
        console.log('Testing database connection...');
        
        try {
            // Test read access
            const { data: visitors, error: readErr } = await client
                .from('visitors')
                .select('count')
                .limit(1);
            
            console.log('Read test result:', { data: visitors, error: readErr });
            
            const readSuccess = !readErr;
            
            // Test write access (only if we have service role)
            let writeSuccess = false;
            let writeError = null;
            
            if (writeCapable) {
                const testVisitorId = 'test-' + Date.now();
                const { error: writeErr } = await client
                    .from('visitors')
                    .insert({
                        visitor_id: testVisitorId,
                        last_seen: new Date().toISOString()
                    });
                
                writeSuccess = !writeErr;
                writeError = writeErr?.message || null;
                
                console.log('Write test result:', { success: writeSuccess, error: writeError });
                
                // Clean up test record if write was successful
                if (writeSuccess) {
                    await client
                        .from('visitors')
                        .delete()
                        .eq('visitor_id', testVisitorId);
                }
            }
            
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'success',
                    timestamp: new Date().toISOString(),
                    env_check: envCheck,
                    client_initialized: true,
                    write_capable: writeCapable,
                    read_test: readSuccess,
                    write_test: writeCapable ? writeSuccess : 'not_tested',
                    errors: {
                        read_error: readErr?.message || null,
                        write_error: writeError
                    }
                })
            };
            
        } catch (dbErr) {
            console.error('Database test error:', dbErr);
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'database_error',
                    message: dbErr.message,
                    env_check: envCheck
                })
            };
        }
        
    } catch (err) {
        console.error('Test function error:', err);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'error',
                message: err.message
            })
        };
    }
};