<?php

use yii\db\Migration;

/**
 * Handles the creation of table `graphs`.
 */
class m180420_165219_create_graphs_table extends Migration
{
    public $db = 'db2';
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('graphs', [
            'id' => $this->primaryKey(),
            'name' => $this->string()->notNull(),
            'nodes' => $this->text(),
            'edges' => $this->text(),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('graphs');
    }
}
