exports.up = async function(knex) {
    await knex.raw(`
        ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'Expired';
    `);
};

exports.down = async function(knex) {
    // ❌ PostgreSQL does NOT support removing ENUM values
    // So we leave this empty intentionally
};